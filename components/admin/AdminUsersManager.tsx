"use client"

import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  createActivatedUserByAdminAction,
  getAdminUserDetailsAction,
  getAdminUsersDataAction,
  sendPromotionalBulkEmailAction,
  setUserBlockedAction,
  terminateAllUserSessionsAction,
  terminateSessionAction,
  updateUserRolesAction,
} from "@/app/actions/admin-users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const promotionalEmailSchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message is required"),
  discountCode: z.string().optional(),
  audienceQuery: z.string().optional(),
  ctaUrl: z.url().optional().or(z.literal("")),
})

type PromotionalEmailFormValues = z.infer<typeof promotionalEmailSchema>

export function AdminUsersManager({
  openBulkMailComposer = false,
}: {
  openBulkMailComposer?: boolean
}) {
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()
  const [bulkMailOpen, setBulkMailOpen] = useState(openBulkMailComposer)
  const [search, setSearch] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserRoles, setNewUserRoles] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [draftRoles, setDraftRoles] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const promoForm = useForm<PromotionalEmailFormValues>({
    resolver: zodResolver(promotionalEmailSchema),
    defaultValues: {
      subject: "Limited-time discount from Lyftberan",
      message:
        "We are running a limited offer for your next shipment. Use the discount below before it expires.",
      discountCode: "",
      audienceQuery: "",
      ctaUrl: "",
    },
  })

  const normalizedSearch = useMemo(() => search.trim(), [search])

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["admin", "users", normalizedSearch, page, pageSize],
    queryFn: () =>
      getAdminUsersDataAction({
        query: normalizedSearch,
        page,
        pageSize,
      }),
  })

  const {
    data: selectedUserDetails,
    isPending: isDetailsPending,
    isFetching: isDetailsFetching,
  } = useQuery({
    queryKey: ["admin", "users", "details", selectedUserId],
    queryFn: () => getAdminUserDetailsAction({ userId: selectedUserId! }),
    enabled: !!selectedUserId,
    staleTime: 0,
  })

  const invalidateUsersQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
  }

  const terminateSessionMutation = useMutation({
    mutationFn: terminateSessionAction,
    onSuccess: async () => {
      await invalidateUsersQueries()
      toast.success("Session terminated.")
    },
    onError: () => {
      toast.error("Could not terminate session.")
    },
  })

  const terminateAllMutation = useMutation({
    mutationFn: terminateAllUserSessionsAction,
    onSuccess: async () => {
      await invalidateUsersQueries()
      toast.success("All user sessions terminated.")
    },
    onError: () => {
      toast.error("Could not terminate all sessions.")
    },
  })

  const blockMutation = useMutation({
    mutationFn: setUserBlockedAction,
    onSuccess: async () => {
      await invalidateUsersQueries()
      toast.success("User state updated.")
    },
    onError: () => {
      toast.error("Could not update block state.")
    },
  })

  const updateRolesMutation = useMutation({
    mutationFn: updateUserRolesAction,
    onSuccess: async () => {
      await invalidateUsersQueries()
      toast.success("Roles updated.")
    },
    onError: () => {
      toast.error("Could not update roles.")
    },
  })

  const createUserMutation = useMutation({
    mutationFn: createActivatedUserByAdminAction,
    onSuccess: async () => {
      await invalidateUsersQueries()
      setNewUserName("")
      setNewUserEmail("")
      setNewUserPassword("")
      setNewUserRoles("")
      toast.success("User created and activated.")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not create user."
      )
    },
  })

  const promotionalEmailMutation = useMutation({
    mutationFn: sendPromotionalBulkEmailAction,
    onSuccess: (result) => {
      toast.success(
        `Promotional email sent: ${result.sentCount}/${result.recipients} delivered.`
      )
      setBulkMailOpen(false)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not send promotional emails."
      )
    },
  })

  const users = data?.users ?? []
  const pagination = data?.pagination ?? {
    page,
    pageSize,
    total: 0,
    totalPages: 1,
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="space-y-2 rounded-lg border border-border p-3">
        <h3 className="text-sm font-semibold">Create User (Activated)</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={newUserName}
            onChange={(event) => setNewUserName(event.target.value)}
            placeholder="Full name"
          />
          <Input
            value={newUserEmail}
            onChange={(event) => setNewUserEmail(event.target.value)}
            placeholder="Email"
            type="email"
          />
          <Input
            value={newUserPassword}
            onChange={(event) => setNewUserPassword(event.target.value)}
            placeholder="Password"
            type="password"
          />
          <Input
            value={newUserRoles}
            onChange={(event) => setNewUserRoles(event.target.value)}
            placeholder="Roles (comma separated, optional)"
          />
        </div>
        <Button
          type="button"
          onClick={async () => {
            const roleNames = newUserRoles
              .split(",")
              .map((role) => role.trim())
              .filter((role) => role.length > 0)

            await createUserMutation.mutateAsync({
              name: newUserName,
              email: newUserEmail,
              password: newUserPassword,
              roleNames,
            })
          }}
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending ? "Creating..." : "Create user"}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Users</h2>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search users by name or email"
            className="max-w-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setBulkMailOpen(true)}
          >
            Bulk promo email
          </Button>
        </div>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading users...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Passkeys</TableHead>
                <TableHead>Active Sessions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.roles.length > 0 ? (
                          item.roles.map((role) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No roles
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.mfaEnabled ? "Enabled" : "Disabled"}
                    </TableCell>
                    <TableCell>{item.passkeysCount}</TableCell>
                    <TableCell>{item.activeSessionsCount}</TableCell>
                    <TableCell>
                      {item.isBlocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Drawer
                        swipeDirection={isMobile ? "down" : "right"}
                        onOpenChange={(isOpen) => {
                          if (isOpen) {
                            setSelectedUserId(item.id)
                          } else if (selectedUserId === item.id) {
                            setSelectedUserId(null)
                            setDraftRoles([])
                          }
                        }}
                      >
                        <DrawerTrigger
                          render={
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          }
                        />
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
                            <DrawerHeader>
                              <DrawerTitle>{item.name}</DrawerTitle>
                              <DrawerDescription>
                                Manage roles, MFA/passkeys, and active sessions.
                              </DrawerDescription>
                            </DrawerHeader>

                            {isDetailsPending || !selectedUserDetails ? (
                              <p className="text-sm text-muted-foreground">
                                Loading user details...
                              </p>
                            ) : (
                              <>
                                <div className="grid gap-4 md:grid-cols-3">
                                  <div className="rounded-lg border border-border p-3">
                                    <p className="text-xs text-muted-foreground">
                                      MFA
                                    </p>
                                    <p className="text-sm font-medium">
                                      {selectedUserDetails.mfa.enabled
                                        ? "Enabled"
                                        : "Disabled"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Verified:{" "}
                                      {selectedUserDetails.mfa.verified
                                        ? "Yes"
                                        : "No"}
                                    </p>
                                  </div>
                                  <div className="rounded-lg border border-border p-3">
                                    <p className="text-xs text-muted-foreground">
                                      Passkeys
                                    </p>
                                    <p className="text-sm font-medium">
                                      {selectedUserDetails.passkeys.length}
                                    </p>
                                  </div>
                                  <div className="rounded-lg border border-border p-3">
                                    <p className="text-xs text-muted-foreground">
                                      Sessions
                                    </p>
                                    <p className="text-sm font-medium">
                                      {selectedUserDetails.sessions.length}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2 rounded-lg border border-border p-3">
                                  <p className="text-sm font-medium">Roles</p>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {selectedUserDetails.availableRoles.map(
                                      (role) => {
                                        const currentRoles =
                                          draftRoles.length > 0
                                            ? draftRoles
                                            : selectedUserDetails.user.roles
                                        const checked = currentRoles
                                          .map((r) => r.toLowerCase())
                                          .includes(role.toLowerCase())

                                        return (
                                          <label
                                            key={role}
                                            className="flex items-center gap-2 text-sm"
                                          >
                                            <Checkbox
                                              checked={checked}
                                              onCheckedChange={(value) => {
                                                const base =
                                                  draftRoles.length > 0
                                                    ? draftRoles
                                                    : selectedUserDetails.user
                                                        .roles

                                                const normalizedBase = base.map(
                                                  (r) => r.toLowerCase()
                                                )
                                                const hasRole =
                                                  normalizedBase.includes(
                                                    role.toLowerCase()
                                                  )

                                                if (value && !hasRole) {
                                                  setDraftRoles([...base, role])
                                                }

                                                if (!value && hasRole) {
                                                  setDraftRoles(
                                                    base.filter(
                                                      (itemRole) =>
                                                        itemRole.toLowerCase() !==
                                                        role.toLowerCase()
                                                    )
                                                  )
                                                }
                                              }}
                                            />
                                            {role}
                                          </label>
                                        )
                                      }
                                    )}
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={async () => {
                                      const nextRoles =
                                        draftRoles.length > 0
                                          ? draftRoles
                                          : selectedUserDetails.user.roles

                                      await updateRolesMutation.mutateAsync({
                                        userId: selectedUserDetails.user.id,
                                        roleNames: nextRoles,
                                      })

                                      setDraftRoles([])
                                    }}
                                    disabled={updateRolesMutation.isPending}
                                  >
                                    {updateRolesMutation.isPending
                                      ? "Saving roles..."
                                      : "Save roles"}
                                  </Button>
                                </div>

                                <div className="space-y-2 rounded-lg border border-border p-3">
                                  <p className="text-sm font-medium">
                                    Passkeys
                                  </p>
                                  {selectedUserDetails.passkeys.length > 0 ? (
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                      {selectedUserDetails.passkeys.map(
                                        (pk) => (
                                          <li key={pk.id}>
                                            {(pk.name ?? "Unnamed passkey") +
                                              " • " +
                                              pk.deviceType}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      No passkeys registered.
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2 rounded-lg border border-border p-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                      Active sessions
                                    </p>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={async () => {
                                        await terminateAllMutation.mutateAsync({
                                          userId: selectedUserDetails.user.id,
                                        })
                                      }}
                                      disabled={terminateAllMutation.isPending}
                                    >
                                      {terminateAllMutation.isPending
                                        ? "Terminating..."
                                        : "Terminate all"}
                                    </Button>
                                  </div>
                                  {selectedUserDetails.sessions.length > 0 ? (
                                    <div className="space-y-2">
                                      {selectedUserDetails.sessions.map((s) => (
                                        <div
                                          key={s.id}
                                          className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                                        >
                                          <div>
                                            <p className="text-sm">
                                              {s.ipAddress ?? "Unknown IP"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {new Date(
                                                s.updatedAt
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={async () => {
                                              await terminateSessionMutation.mutateAsync(
                                                {
                                                  sessionId: s.id,
                                                }
                                              )
                                            }}
                                            disabled={
                                              terminateSessionMutation.isPending
                                            }
                                          >
                                            End
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      No active sessions.
                                    </p>
                                  )}
                                </div>

                                <div className="w-full">
                                  <Button
                                    type="button"
                                    className="w-full"
                                    variant={
                                      selectedUserDetails.user.isBlocked
                                        ? "outline"
                                        : "destructive"
                                    }
                                    onClick={async () => {
                                      await blockMutation.mutateAsync({
                                        userId: selectedUserDetails.user.id,
                                        blocked:
                                          !selectedUserDetails.user.isBlocked,
                                      })
                                    }}
                                    disabled={blockMutation.isPending}
                                  >
                                    {blockMutation.isPending
                                      ? "Updating..."
                                      : selectedUserDetails.user.isBlocked
                                        ? "Unblock user"
                                        : "Block user"}
                                  </Button>
                                </div>

                                {isDetailsFetching ? (
                                  <p className="text-xs text-muted-foreground">
                                    Refreshing details...
                                  </p>
                                ) : null}
                              </>
                            )}
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              Showing page {pagination.page} of {pagination.totalPages} (
              {pagination.total} total)
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="admin-users-page-size">Rows</label>
              <select
                id="admin-users-page-size"
                className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                value={pagination.pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value))
                  setPage(1)
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pagination.page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(pagination.totalPages, prev + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {isFetching && !isPending ? (
        <p className="text-xs text-muted-foreground">Refreshing users...</p>
      ) : null}

      <Sheet open={bulkMailOpen} onOpenChange={setBulkMailOpen}>
        <SheetContent side="right" className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Send promotional email campaign</SheetTitle>
            <SheetDescription>
              Send a discount or promotional message to users in bulk.
            </SheetDescription>
          </SheetHeader>

          <Form {...promoForm}>
            <form
              className="space-y-4 p-4"
              onSubmit={promoForm.handleSubmit(async (values) => {
                await promotionalEmailMutation.mutateAsync({
                  subject: values.subject,
                  message: values.message,
                  discountCode: values.discountCode?.trim() || undefined,
                  audienceQuery: values.audienceQuery?.trim() || undefined,
                  ctaUrl: values.ctaUrl?.trim() || undefined,
                })
              })}
            >
              <div className="space-y-2">
                <Label htmlFor="promo-subject">Subject</Label>
                <FormField
                  control={promoForm.control}
                  name="subject"
                  render={({ field }) => (
                    <Input
                      id="promo-subject"
                      placeholder="Subject line"
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-message">Message</Label>
                <FormField
                  control={promoForm.control}
                  name="message"
                  render={({ field }) => (
                    <Textarea
                      id="promo-message"
                      placeholder="Campaign message"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="promo-discount">Discount code</Label>
                  <FormField
                    control={promoForm.control}
                    name="discountCode"
                    render={({ field }) => (
                      <Input
                        id="promo-discount"
                        placeholder="SAVE15"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-audience">Audience filter</Label>
                  <FormField
                    control={promoForm.control}
                    name="audienceQuery"
                    render={({ field }) => (
                      <Input
                        id="promo-audience"
                        placeholder="name or email contains..."
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-cta">Offer URL (optional)</Label>
                <FormField
                  control={promoForm.control}
                  name="ctaUrl"
                  render={({ field }) => (
                    <Input
                      id="promo-cta"
                      placeholder="https://example.com/offers"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={promotionalEmailMutation.isPending}
              >
                {promotionalEmailMutation.isPending
                  ? "Sending..."
                  : "Send promotional emails"}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
