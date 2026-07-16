"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  getNewsletterAdminDataAction,
  scheduleNewsletterCampaignByAdminAction,
  sendNewsletterCampaignNowByAdminAction,
  upsertNewsletterSubscriberByAdminAction,
} from "@/app/actions/newsletter"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QuillEditor } from "@/components/ui/quill-editor"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const signupSchema = z.object({
  email: z.email("Valid email is required"),
  name: z.string().optional(),
})

const campaignSchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  message: z.string().refine(
    (value) =>
      value
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim().length >= 10,
    "Message is required"
  ),
  discountCode: z.string().optional(),
  ctaUrl: z.url("Enter a valid URL").optional().or(z.literal("")),
  scheduledFor: z.string().optional(),
})

type SignupFormValues = z.infer<typeof signupSchema>
type CampaignFormValues = z.infer<typeof campaignSchema>

function campaignTone(status: string) {
  if (status === "sent") {
    return "bg-emerald-500/10 text-emerald-700"
  }

  if (status === "scheduled") {
    return "bg-sky-500/10 text-sky-700"
  }

  if (status === "sending") {
    return "bg-amber-500/10 text-amber-700"
  }

  return "bg-destructive/10 text-destructive"
}

export default function AdminNewsletterPage() {
  const queryClient = useQueryClient()

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  })

  const campaignForm = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      subject: "",
      message: "",
      discountCode: "",
      ctaUrl: "",
      scheduledFor: "",
    },
  })

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["admin", "newsletter"],
    queryFn: () => getNewsletterAdminDataAction(),
    staleTime: 2_000,
    refetchInterval: 5_000,
    refetchOnWindowFocus: true,
  })

  const invalidateNewsletter = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "newsletter"] })
  }

  const signupMutation = useMutation({
    mutationFn: upsertNewsletterSubscriberByAdminAction,
    onSuccess: async (result) => {
      await invalidateNewsletter()
      signupForm.reset()
      toast.success(
        result.existed ? "Subscriber re-activated." : "Subscriber added."
      )
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not add subscriber."
      )
    },
  })

  const sendNowMutation = useMutation({
    mutationFn: sendNewsletterCampaignNowByAdminAction,
    onSuccess: async (result) => {
      await invalidateNewsletter()
      toast.success(
        result.queued
          ? `Campaign queued for ${result.recipients} subscribers.`
          : `Campaign sent: ${result.sentCount}/${result.recipients}`
      )
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not send campaign."
      )
    },
  })

  const scheduleMutation = useMutation({
    mutationFn: scheduleNewsletterCampaignByAdminAction,
    onSuccess: async (result) => {
      await invalidateNewsletter()
      toast.success(
        `Campaign scheduled for ${
          result.scheduledFor
            ? new Date(result.scheduledFor).toLocaleString()
            : "selected time"
        }`
      )
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not schedule campaign."
      )
    },
  })

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Newsletter
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Admin-only newsletter signup, campaign sending, and
                    scheduling.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h2 className="text-lg font-semibold">Add Subscriber</h2>
                  <Form {...signupForm}>
                    <form
                      className="mt-3 space-y-3"
                      onSubmit={signupForm.handleSubmit(async (values) => {
                        await signupMutation.mutateAsync({
                          email: values.email,
                          name: values.name?.trim() || undefined,
                        })
                      })}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="subscriber-email">Email</Label>
                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <Input
                              id="subscriber-email"
                              placeholder="subscriber@example.com"
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subscriber-name">Name (optional)</Label>
                        <FormField
                          control={signupForm.control}
                          name="name"
                          render={({ field }) => (
                            <Input
                              id="subscriber-name"
                              placeholder="Subscriber name"
                              value={field.value ?? ""}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={signupMutation.isPending}>
                        {signupMutation.isPending
                          ? "Saving..."
                          : "Add subscriber"}
                      </Button>
                    </form>
                  </Form>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <h2 className="text-lg font-semibold">Campaign Composer</h2>
                  <Form {...campaignForm}>
                    <form
                      className="mt-3 space-y-3"
                      onSubmit={(event) => event.preventDefault()}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="campaign-subject">Subject</Label>
                        <FormField
                          control={campaignForm.control}
                          name="subject"
                          render={({ field }) => (
                            <Input
                              id="campaign-subject"
                              placeholder="Campaign subject"
                              {...field}
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campaign-message">Message</Label>
                        <FormField
                          control={campaignForm.control}
                          name="message"
                          render={({ field }) => (
                            <QuillEditor
                              placeholder="Write your campaign message..."
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="campaign-discount">
                            Discount code
                          </Label>
                          <FormField
                            control={campaignForm.control}
                            name="discountCode"
                            render={({ field }) => (
                              <Input
                                id="campaign-discount"
                                placeholder="SAVE20"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="campaign-url">Offer URL</Label>
                          <FormField
                            control={campaignForm.control}
                            name="ctaUrl"
                            render={({ field }) => (
                              <Input
                                id="campaign-url"
                                placeholder="https://example.com/offers"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campaign-scheduled">
                          Schedule time
                        </Label>
                        <FormField
                          control={campaignForm.control}
                          name="scheduledFor"
                          render={({ field }) => (
                            <Input
                              id="campaign-scheduled"
                              type="datetime-local"
                              value={field.value ?? ""}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          disabled={sendNowMutation.isPending}
                          onClick={campaignForm.handleSubmit(async (values) => {
                            await sendNowMutation.mutateAsync({
                              subject: values.subject,
                              message: values.message,
                              discountCode:
                                values.discountCode?.trim() || undefined,
                              ctaUrl: values.ctaUrl?.trim() || undefined,
                            })
                          })}
                        >
                          {sendNowMutation.isPending
                            ? "Sending..."
                            : "Send Now"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          disabled={scheduleMutation.isPending}
                          onClick={campaignForm.handleSubmit(async (values) => {
                            if (!values.scheduledFor) {
                              toast.error("Select a schedule time")
                              return
                            }

                            await scheduleMutation.mutateAsync({
                              subject: values.subject,
                              message: values.message,
                              discountCode:
                                values.discountCode?.trim() || undefined,
                              ctaUrl: values.ctaUrl?.trim() || undefined,
                              scheduledFor: values.scheduledFor,
                            })
                          })}
                        >
                          {scheduleMutation.isPending
                            ? "Scheduling..."
                            : "Schedule"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>

              <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
                <div className="overflow-hidden rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-3 text-sm font-semibold">Subscribers</h3>
                  {isPending ? (
                    <p className="text-sm text-muted-foreground">
                      Loading subscribers...
                    </p>
                  ) : (
                    <div className="max-h-96 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subscribed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(data?.subscribers ?? []).length > 0 ? (
                            (data?.subscribers ?? []).map((subscriber) => (
                              <TableRow key={subscriber.id}>
                                <TableCell>{subscriber.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {subscriber.isActive
                                      ? "Active"
                                      : "Inactive"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    subscriber.subscribedAt
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={3}
                                className="text-center text-muted-foreground"
                              >
                                No subscribers yet.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card p-4">
                  <h3 className="mb-3 text-sm font-semibold">Campaigns</h3>
                  {isPending ? (
                    <p className="text-sm text-muted-foreground">
                      Loading campaigns...
                    </p>
                  ) : (
                    <div className="max-h-96 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Audience</TableHead>
                            <TableHead>When</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(data?.campaigns ?? []).length > 0 ? (
                            (data?.campaigns ?? []).map((campaign) => (
                              <TableRow key={campaign.id}>
                                <TableCell>{campaign.subject}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={campaignTone(campaign.status)}
                                    variant="outline"
                                  >
                                    {campaign.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {campaign.sentCount}/
                                  {campaign.totalRecipients}
                                </TableCell>
                                <TableCell>
                                  {campaign.sentAt
                                    ? new Date(campaign.sentAt).toLocaleString()
                                    : campaign.scheduledFor
                                      ? new Date(
                                          campaign.scheduledFor
                                        ).toLocaleString()
                                      : "-"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center text-muted-foreground"
                              >
                                No campaigns yet.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>

              {isFetching && !isPending ? (
                <p className="px-4 text-xs text-muted-foreground lg:px-6">
                  Refreshing newsletter data...
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
