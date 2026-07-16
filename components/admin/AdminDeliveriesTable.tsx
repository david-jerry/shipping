"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  createDeliveryLocationByAdminAction,
  createDeliveryByAdminAction,
  deleteDeliveryLocationByAdminAction,
  deleteDeliveryByAdminAction,
  getDeliveryLocationsByAdminAction,
  getDeliveryUsersForSelectAction,
  searchOpenStreetAddressesAction,
  updateDeliveryLocationByAdminAction,
  updateDeliveryByAdminAction,
} from "@/app/actions/deliveries"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  createDeliveryByAdminSchema,
  updateDeliveryRouteByAdminSchema,
} from "@/drizzle/schema/delivery"
import {
  type AdminDeliveryTableFilters,
  type DeliveryDbStatus,
  type DeliveryLocationRow,
  type DeliveryRow,
} from "@/lib/deliveries"
import { Textarea } from "@/components/ui/textarea"

type AdminDeliveriesTableProps = {
  deliveries: DeliveryRow[]
  filters: AdminDeliveryTableFilters
  onFiltersChange: (filters: AdminDeliveryTableFilters) => void
  isLoading: boolean
  isFetching: boolean
  openCreateOnLoad?: boolean
}

const createDeliveryFormSchema = createDeliveryByAdminSchema.omit({
  trackingNumber: true,
})

const updateDeliveryFormSchema = updateDeliveryRouteByAdminSchema.extend({
  status: createDeliveryByAdminSchema.shape.status,
})

type CreateDeliveryFormValues = z.infer<typeof createDeliveryFormSchema>
type UpdateDeliveryFormValues = z.infer<typeof updateDeliveryFormSchema>

const deliveryLocationFormSchema = z.object({
  locationId: z.string().uuid().optional(),
  deliveryId: z.string().uuid(),
  streetAddress: z.string().min(3),
  country: z.string().min(2),
  transitNote: z.string().max(1_000).optional().nullable(),
  reachedAt: z.string().optional().nullable(),
  isCurrentLocation: z.boolean(),
})

type DeliveryLocationFormValues = z.infer<typeof deliveryLocationFormSchema>

const statusOptions: Array<{ label: string; value: DeliveryDbStatus }> = [
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
]

function deliveryStatusToDbStatus(
  status: DeliveryRow["status"]
): DeliveryDbStatus {
  if (status === "Pending") {
    return "pending"
  }

  if (status === "Assigned") {
    return "assigned"
  }

  if (status === "In Transit") {
    return "in_transit"
  }

  if (status === "Delivered") {
    return "delivered"
  }

  if (status === "Failed") {
    return "failed"
  }

  return "cancelled"
}

function statusTone(status: DeliveryRow["status"]) {
  if (status === "Delivered") {
    return "bg-emerald-500/10 text-emerald-700"
  }

  if (status === "In Transit") {
    return "bg-amber-500/10 text-amber-700"
  }

  if (status === "Failed" || status === "Cancelled") {
    return "bg-destructive/10 text-destructive"
  }

  return "bg-sky-500/10 text-sky-700"
}

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value)
    }, delayMs)

    return () => window.clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}

export function AdminDeliveriesTable({
  deliveries,
  filters,
  onFiltersChange,
  isLoading,
  isFetching,
  openCreateOnLoad,
}: AdminDeliveriesTableProps) {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [userEmailSearch, setUserEmailSearch] = useState("")
  const [userPage, setUserPage] = useState(1)
  const [editingDelivery, setEditingDelivery] = useState<DeliveryRow | null>(
    null
  )
  const [editingLocation, setEditingLocation] =
    useState<DeliveryLocationRow | null>(null)

  const createForm = useForm<CreateDeliveryFormValues>({
    resolver: zodResolver(createDeliveryFormSchema),
    defaultValues: {
      userId: "",
      status: "pending",
      pickupAddress: "",
      dropoffAddress: "",
      notes: "",
    },
  })

  const editForm = useForm<UpdateDeliveryFormValues>({
    resolver: zodResolver(updateDeliveryFormSchema),
    defaultValues: {
      deliveryId: "",
      status: "pending",
      pickupAddress: "",
      dropoffAddress: "",
      notes: "",
    },
  })

  const locationForm = useForm<DeliveryLocationFormValues>({
    resolver: zodResolver(deliveryLocationFormSchema),
    defaultValues: {
      locationId: undefined,
      deliveryId: "",
      streetAddress: "",
      country: "",
      transitNote: "",
      reachedAt: "",
      isCurrentLocation: true,
    },
  })

  const invalidateAdminDeliveries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "deliveries"] })
    await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
  }

  const createMutation = useMutation({
    mutationFn: createDeliveryByAdminAction,
    onSuccess: async () => {
      await invalidateAdminDeliveries()
      setCreateOpen(false)
      createForm.reset()
      toast.success("Delivery created.")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not create delivery."
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateDeliveryByAdminAction,
    onSuccess: async () => {
      await invalidateAdminDeliveries()
      setEditingDelivery(null)
      toast.success("Delivery updated.")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not update delivery."
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDeliveryByAdminAction,
    onSuccess: async () => {
      await invalidateAdminDeliveries()
      toast.success("Delivery deleted.")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not delete delivery."
      )
    },
  })

  const {
    data: locationRows = [],
    isPending: isLocationsPending,
    isFetching: isLocationsFetching,
  } = useQuery({
    queryKey: ["admin", "delivery", "locations", editingDelivery?.id],
    queryFn: () =>
      getDeliveryLocationsByAdminAction({
        deliveryId: editingDelivery?.id ?? "",
      }),
    enabled: !!editingDelivery,
    staleTime: 1_000,
    refetchOnWindowFocus: false,
  })

  const createLocationMutation = useMutation({
    mutationFn: createDeliveryLocationByAdminAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "delivery", "locations", editingDelivery?.id],
      })
      await invalidateAdminDeliveries()
      locationForm.reset({
        locationId: undefined,
        deliveryId: editingDelivery?.id ?? "",
        streetAddress: "",
        country: "",
        transitNote: "",
        reachedAt: "",
        isCurrentLocation: true,
      })
      setEditingLocation(null)
      toast.success("Location added.")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not add location."
      )
    },
  })

  const updateLocationMutation = useMutation({
    mutationFn: updateDeliveryLocationByAdminAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "delivery", "locations", editingDelivery?.id],
      })
      await invalidateAdminDeliveries()
      locationForm.reset({
        locationId: undefined,
        deliveryId: editingDelivery?.id ?? "",
        streetAddress: "",
        country: "",
        transitNote: "",
        reachedAt: "",
        isCurrentLocation: true,
      })
      setEditingLocation(null)
      toast.success("Location updated.")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not update location."
      )
    },
  })

  const deleteLocationMutation = useMutation({
    mutationFn: deleteDeliveryLocationByAdminAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "delivery", "locations", editingDelivery?.id],
      })
      await invalidateAdminDeliveries()
      toast.success("Location deleted.")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not delete location."
      )
    },
  })

  const selectedStatus = editForm.watch("status")
  const selectedUserId = createForm.watch("userId")
  const createPickupValue = createForm.watch("pickupAddress") ?? ""
  const createDropoffValue = createForm.watch("dropoffAddress") ?? ""
  const editPickupValue = editForm.watch("pickupAddress") ?? ""
  const editDropoffValue = editForm.watch("dropoffAddress") ?? ""

  const createPickupQuery = useDebouncedValue(createPickupValue, 350)
  const createDropoffQuery = useDebouncedValue(createDropoffValue, 350)
  const editPickupQuery = useDebouncedValue(editPickupValue, 350)
  const editDropoffQuery = useDebouncedValue(editDropoffValue, 350)

  const {
    data: deliveryUsersData,
    isFetching: isUsersFetching,
    isPending: isUsersPending,
  } = useQuery({
    queryKey: ["admin", "delivery", "users", userEmailSearch, userPage],
    queryFn: () =>
      getDeliveryUsersForSelectAction({
        emailQuery: userEmailSearch,
        page: userPage,
        pageSize: 10,
      }),
    enabled: createOpen,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  })

  const { data: createPickupAddresses } = useQuery({
    queryKey: ["admin", "openstreet", "create", "pickup", createPickupQuery],
    queryFn: () =>
      searchOpenStreetAddressesAction({
        query: createPickupQuery,
      }),
    enabled: createOpen && createPickupQuery.trim().length >= 3,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  })

  const { data: createDropoffAddresses } = useQuery({
    queryKey: ["admin", "openstreet", "create", "dropoff", createDropoffQuery],
    queryFn: () =>
      searchOpenStreetAddressesAction({
        query: createDropoffQuery,
      }),
    enabled: createOpen && createDropoffQuery.trim().length >= 3,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  })

  const { data: editPickupAddresses } = useQuery({
    queryKey: ["admin", "openstreet", "edit", "pickup", editPickupQuery],
    queryFn: () =>
      searchOpenStreetAddressesAction({
        query: editPickupQuery,
      }),
    enabled: !!editingDelivery && editPickupQuery.trim().length >= 3,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  })

  const { data: editDropoffAddresses } = useQuery({
    queryKey: ["admin", "openstreet", "edit", "dropoff", editDropoffQuery],
    queryFn: () =>
      searchOpenStreetAddressesAction({
        query: editDropoffQuery,
      }),
    enabled: !!editingDelivery && editDropoffQuery.trim().length >= 3,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  })

  const modalTitle = useMemo(() => {
    if (!editingDelivery) {
      return "Update Delivery"
    }

    return `Update ${editingDelivery.trackingNumber}`
  }, [editingDelivery])

  useEffect(() => {
    if (openCreateOnLoad) {
      setCreateOpen(true)
    }
  }, [openCreateOnLoad])

  useEffect(() => {
    if (!editingDelivery) {
      setEditingLocation(null)
      locationForm.reset({
        locationId: undefined,
        deliveryId: "",
        streetAddress: "",
        country: "",
        transitNote: "",
        reachedAt: "",
        isCurrentLocation: true,
      })
      return
    }

    locationForm.reset({
      locationId: undefined,
      deliveryId: editingDelivery.id,
      streetAddress: "",
      country: "",
      transitNote: "",
      reachedAt: "",
      isCurrentLocation: true,
    })
  }, [editingDelivery, locationForm])

  useEffect(() => {
    if (!editingDelivery || !editingLocation) {
      return
    }

    const reachedAtValue = editingLocation.reachedAt
      ? new Date(editingLocation.reachedAt).toISOString().slice(0, 16)
      : ""

    locationForm.reset({
      locationId: editingLocation.id,
      deliveryId: editingDelivery.id,
      streetAddress: editingLocation.streetAddress,
      country: editingLocation.country,
      transitNote: editingLocation.transitNote ?? "",
      reachedAt: reachedAtValue,
      isCurrentLocation: editingLocation.isCurrentLocation,
    })
  }, [editingDelivery, editingLocation, locationForm])

  useEffect(() => {
    setUserPage(1)
  }, [userEmailSearch])

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={filters.trackingCode ?? ""}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              trackingCode: event.target.value,
            })
          }
          placeholder="Search tracking code"
          className="sm:max-w-xs"
        />

        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value as AdminDeliveryTableFilters["status"],
            })
          }
        >
          <SelectTrigger className="sm:w-44" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_transit">In transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.dateRange}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              dateRange: value as AdminDeliveryTableFilters["dateRange"],
            })
          }
        >
          <SelectTrigger className="sm:w-40" aria-label="Filter by date range">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>

        <Sheet open={createOpen} onOpenChange={setCreateOpen}>
          <SheetTrigger
            render={
              <Button type="button" className="sm:ml-auto">
                Create Delivery
              </Button>
            }
          />
          <SheetContent side="right" className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Create delivery</SheetTitle>
              <SheetDescription>
                Create a delivery for a recipient user. Tracking number is
                generated automatically.
              </SheetDescription>
            </SheetHeader>

            <Form {...createForm}>
              <form
                className="space-y-4 p-4"
                onSubmit={createForm.handleSubmit(async (values) => {
                  await createMutation.mutateAsync({
                    userId: values.userId,
                    pickupAddress: values.pickupAddress,
                    dropoffAddress: values.dropoffAddress,
                    status: values.status ?? "pending",
                    notes: values.notes?.trim() || null,
                  })
                })}
              >
                <div className="space-y-2">
                  <Label htmlFor="create-tracking">Tracking number</Label>
                  <Input
                    id="create-tracking"
                    value="Auto-generated on create"
                    readOnly
                    disabled
                    aria-readonly="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-email-search">
                    User (search by email)
                  </Label>
                  <Input
                    id="user-email-search"
                    placeholder="Search users by email"
                    value={userEmailSearch}
                    onChange={(event) => setUserEmailSearch(event.target.value)}
                  />
                  <FormField
                    control={createForm.control}
                    name="userId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-label="Select user by email"
                        >
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {(deliveryUsersData?.users ?? []).map((candidate) => (
                            <SelectItem key={candidate.id} value={candidate.id}>
                              {candidate.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {isUsersPending || isUsersFetching
                        ? "Loading users..."
                        : `${deliveryUsersData?.total ?? 0} users found`}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setUserPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={userPage <= 1}
                      >
                        Prev
                      </Button>
                      <span>
                        Page {deliveryUsersData?.page ?? userPage} of{" "}
                        {deliveryUsersData?.totalPages ?? 1}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setUserPage((prev) =>
                            Math.min(
                              prev + 1,
                              deliveryUsersData?.totalPages ?? 1
                            )
                          )
                        }
                        disabled={
                          userPage >= (deliveryUsersData?.totalPages ?? 1)
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                  {selectedUserId ? (
                    <p className="text-xs text-muted-foreground">
                      Selected user ID: {selectedUserId}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <FormField
                    control={createForm.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as DeliveryDbStatus)
                        }
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-label="Create delivery status"
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-pickup">Pickup address</Label>
                  <FormField
                    control={createForm.control}
                    name="pickupAddress"
                    render={({ field }) => (
                      <Input
                        id="create-pickup"
                        placeholder="Origin address"
                        {...field}
                      />
                    )}
                  />
                  {(createPickupAddresses?.results ?? []).length > 0 ? (
                    <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-background">
                      {(createPickupAddresses?.results ?? []).map((option) => (
                        <button
                          key={`create-pickup-${option.displayName}`}
                          type="button"
                          className="block w-full px-3 py-2 text-left text-xs hover:bg-muted"
                          onClick={() => {
                            createForm.setValue(
                              "pickupAddress",
                              option.displayName,
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              }
                            )
                          }}
                        >
                          <span className="font-medium">
                            {option.street || option.displayName}
                          </span>
                          {option.country ? (
                            <span className="ml-1 text-muted-foreground">
                              ({option.country})
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-dropoff">Dropoff address</Label>
                  <FormField
                    control={createForm.control}
                    name="dropoffAddress"
                    render={({ field }) => (
                      <Input
                        id="create-dropoff"
                        placeholder="Destination address"
                        {...field}
                      />
                    )}
                  />
                  {(createDropoffAddresses?.results ?? []).length > 0 ? (
                    <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-background">
                      {(createDropoffAddresses?.results ?? []).map((option) => (
                        <button
                          key={`create-dropoff-${option.displayName}`}
                          type="button"
                          className="block w-full px-3 py-2 text-left text-xs hover:bg-muted"
                          onClick={() => {
                            createForm.setValue(
                              "dropoffAddress",
                              option.displayName,
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              }
                            )
                          }}
                        >
                          <span className="font-medium">
                            {option.street || option.displayName}
                          </span>
                          {option.country ? (
                            <span className="ml-1 text-muted-foreground">
                              ({option.country})
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-notes">Description</Label>
                  <FormField
                    control={createForm.control}
                    name="notes"
                    render={({ field }) => (
                      <Textarea
                        id="create-notes"
                        placeholder="Delivery notes or description"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create delivery"}
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="py-6 text-sm text-muted-foreground">
          Loading deliveries...
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Dropoff</TableHead>
                <TableHead>Last Known Location</TableHead>
                <TableHead>Checkpoints</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.length > 0 ? (
                deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">
                      {delivery.trackingNumber}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusTone(delivery.status)}
                        variant="outline"
                      >
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{delivery.pickup}</TableCell>
                    <TableCell>{delivery.dropoff}</TableCell>
                    <TableCell>
                      {delivery.lastKnownLocation ?? "No location updates"}
                    </TableCell>
                    <TableCell>{delivery.locationCount}</TableCell>
                    <TableCell>
                      {new Date(delivery.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            editForm.reset({
                              deliveryId: delivery.id,
                              status: deliveryStatusToDbStatus(delivery.status),
                              pickupAddress: delivery.pickup,
                              dropoffAddress: delivery.dropoff,
                              notes: "",
                            })
                            setEditingDelivery(delivery)
                          }}
                        >
                          Update
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={deleteMutation.isPending}
                          onClick={async () => {
                            await deleteMutation.mutateAsync({
                              deliveryId: delivery.id,
                            })
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No deliveries matched the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {isFetching && !isLoading ? (
        <p className="text-xs text-muted-foreground">
          Refreshing filtered results...
        </p>
      ) : null}

      <Sheet
        open={!!editingDelivery}
        onOpenChange={(open) => !open && setEditingDelivery(null)}
      >
        <SheetContent side="right" className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{modalTitle}</SheetTitle>
            <SheetDescription>
              Update status, route, and description for this delivery.
            </SheetDescription>
          </SheetHeader>

          <Form {...editForm}>
            <form
              className="space-y-4 p-4"
              onSubmit={editForm.handleSubmit(async (values) => {
                await updateMutation.mutateAsync({
                  deliveryId: values.deliveryId,
                  status: values.status ?? "pending",
                  pickupAddress: values.pickupAddress,
                  dropoffAddress: values.dropoffAddress,
                  notes: values.notes?.trim() || null,
                })
              })}
            >
              <div className="space-y-2">
                <Label>Status</Label>
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as DeliveryDbStatus)
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-label="Update delivery status"
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-pickup">Pickup address</Label>
                <FormField
                  control={editForm.control}
                  name="pickupAddress"
                  render={({ field }) => (
                    <Input
                      id="edit-pickup"
                      placeholder="Origin address"
                      {...field}
                    />
                  )}
                />
                {(editPickupAddresses?.results ?? []).length > 0 ? (
                  <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-background">
                    {(editPickupAddresses?.results ?? []).map((option) => (
                      <button
                        key={`edit-pickup-${option.displayName}`}
                        type="button"
                        className="block w-full px-3 py-2 text-left text-xs hover:bg-muted"
                        onClick={() => {
                          editForm.setValue(
                            "pickupAddress",
                            option.displayName,
                            {
                              shouldDirty: true,
                              shouldTouch: true,
                            }
                          )
                        }}
                      >
                        <span className="font-medium">
                          {option.street || option.displayName}
                        </span>
                        {option.country ? (
                          <span className="ml-1 text-muted-foreground">
                            ({option.country})
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dropoff">Dropoff address</Label>
                <FormField
                  control={editForm.control}
                  name="dropoffAddress"
                  render={({ field }) => (
                    <Input
                      id="edit-dropoff"
                      placeholder="Destination address"
                      {...field}
                    />
                  )}
                />
                {(editDropoffAddresses?.results ?? []).length > 0 ? (
                  <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-background">
                    {(editDropoffAddresses?.results ?? []).map((option) => (
                      <button
                        key={`edit-dropoff-${option.displayName}`}
                        type="button"
                        className="block w-full px-3 py-2 text-left text-xs hover:bg-muted"
                        onClick={() => {
                          editForm.setValue(
                            "dropoffAddress",
                            option.displayName,
                            {
                              shouldDirty: true,
                              shouldTouch: true,
                            }
                          )
                        }}
                      >
                        <span className="font-medium">
                          {option.street || option.displayName}
                        </span>
                        {option.country ? (
                          <span className="ml-1 text-muted-foreground">
                            ({option.country})
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Description</Label>
                <FormField
                  control={editForm.control}
                  name="notes"
                  render={({ field }) => (
                    <Textarea
                      id="edit-notes"
                      placeholder="Update delivery notes or description"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingDelivery(null)}
                >
                  Cancel
                </Button>
              </div>

              {selectedStatus === "delivered" ? (
                <p className="text-xs text-muted-foreground">
                  Marking as delivered sets delivered time to now.
                </p>
              ) : null}
            </form>
          </Form>

          <div className="space-y-4 border-t border-border p-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">
                Reached Locations
              </h3>
              <p className="text-xs text-muted-foreground">
                Add and maintain checkpoints the delivery has reached.
              </p>
            </div>

            {isLocationsPending ? (
              <p className="text-xs text-muted-foreground">
                Loading locations...
              </p>
            ) : locationRows.length > 0 ? (
              <div className="space-y-2">
                {locationRows.map((location) => (
                  <div
                    key={location.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          #{location.sequence} {location.fullAddress}
                        </p>
                        {location.transitNote ? (
                          <p className="text-xs text-muted-foreground">
                            {location.transitNote}
                          </p>
                        ) : null}
                        <p className="text-xs text-muted-foreground">
                          {location.reachedAt
                            ? `Reached ${new Date(location.reachedAt).toLocaleString()}`
                            : "Reached time not set"}
                        </p>
                        {location.isCurrentLocation ? (
                          <Badge variant="outline">Current location</Badge>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingLocation(location)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={deleteLocationMutation.isPending}
                          onClick={async () => {
                            await deleteLocationMutation.mutateAsync({
                              locationId: location.id,
                            })
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No locations yet for this delivery.
              </p>
            )}

            <Form {...locationForm}>
              <form
                className="space-y-3 rounded-md border border-border bg-muted/20 p-3"
                onSubmit={locationForm.handleSubmit(async (values) => {
                  const reachedAtValue = values.reachedAt?.trim()
                    ? new Date(values.reachedAt).toISOString()
                    : null

                  if (values.locationId) {
                    await updateLocationMutation.mutateAsync({
                      locationId: values.locationId,
                      streetAddress: values.streetAddress,
                      country: values.country,
                      transitNote: values.transitNote?.trim() || null,
                      reachedAt: reachedAtValue,
                      isCurrentLocation: values.isCurrentLocation,
                    })
                    return
                  }

                  await createLocationMutation.mutateAsync({
                    deliveryId: values.deliveryId,
                    streetAddress: values.streetAddress,
                    country: values.country,
                    transitNote: values.transitNote?.trim() || null,
                    reachedAt: reachedAtValue,
                    isCurrentLocation: values.isCurrentLocation,
                  })
                })}
              >
                <div className="space-y-2">
                  <Label htmlFor="location-street">Street address</Label>
                  <FormField
                    control={locationForm.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <Input
                        id="location-street"
                        placeholder="Checkpoint street address"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location-country">Country</Label>
                  <FormField
                    control={locationForm.control}
                    name="country"
                    render={({ field }) => (
                      <Input
                        id="location-country"
                        placeholder="Country"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location-reached-at">Reached at</Label>
                  <FormField
                    control={locationForm.control}
                    name="reachedAt"
                    render={({ field }) => (
                      <Input
                        id="location-reached-at"
                        type="datetime-local"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location-note">Transit note</Label>
                  <FormField
                    control={locationForm.control}
                    name="transitNote"
                    render={({ field }) => (
                      <Textarea
                        id="location-note"
                        placeholder="Optional note for this checkpoint"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FormField
                    control={locationForm.control}
                    name="isCurrentLocation"
                    render={({ field }) => (
                      <Button
                        type="button"
                        size="sm"
                        variant={field.value ? "default" : "outline"}
                        onClick={() => field.onChange(!field.value)}
                      >
                        {field.value
                          ? "Marked as current"
                          : "Set as current location"}
                      </Button>
                    )}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={
                      createLocationMutation.isPending ||
                      updateLocationMutation.isPending
                    }
                  >
                    {editingLocation ? "Update location" : "Add location"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingLocation(null)
                      locationForm.reset({
                        locationId: undefined,
                        deliveryId: editingDelivery?.id ?? "",
                        streetAddress: "",
                        country: "",
                        transitNote: "",
                        reachedAt: "",
                        isCurrentLocation: true,
                      })
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </Form>

            {isLocationsFetching && !isLocationsPending ? (
              <p className="text-xs text-muted-foreground">
                Syncing latest locations...
              </p>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
