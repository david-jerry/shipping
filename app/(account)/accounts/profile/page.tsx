"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import QRCode from "react-qr-code"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

type TabKey = "profile" | "security"

type AuthClientLoose = {
  updateUser?: (payload: {
    name?: string
    image?: string
  }) => Promise<{ error?: { message?: string } }>
  changePassword?: (payload: {
    currentPassword: string
    newPassword: string
    revokeOtherSessions?: boolean
  }) => Promise<{ error?: { message?: string } }>
  twoFactor?: {
    enable?: (payload?: { password?: string; issuer?: string }) => Promise<{
      data?: { totpURI?: string; backupCodes?: string[] }
      error?: { message?: string }
    }>
    disable?: (payload?: {
      password?: string
    }) => Promise<{ error?: { message?: string } }>
    getTotpUri?: (payload?: { password?: string }) => Promise<{
      data?: { totpURI?: string }
      error?: { message?: string }
    }>
    verifyTotp?: (payload: {
      code: string
      trustDevice?: boolean
    }) => Promise<{ error?: { message?: string } }>
  }
  passkey?: {
    addPasskey?: (payload?: {
      name?: string
    }) => Promise<{ error?: { message?: string } }>
    create?: (payload?: {
      name?: string
    }) => Promise<{ error?: { message?: string } }>
    register?: (payload?: {
      name?: string
    }) => Promise<{ error?: { message?: string } }>
    listPasskeys?: () => Promise<{
      data?: Array<{ id: string; name?: string; createdAt?: string }>
      error?: { message?: string }
    }>
    listUserPasskeys?: () => Promise<{
      data?: Array<{ id: string; name?: string; createdAt?: string }>
      error?: { message?: string }
    }>
    deletePasskey?: (payload: {
      id: string
    }) => Promise<{ error?: { message?: string } }>
    remove?: (payload: {
      id: string
    }) => Promise<{ error?: { message?: string } }>
  }
}

type ProfileFormValues = {
  name: string
  avatarUrl: string
}

type SecurityFormValues = {
  currentPassword: string
  newPassword: string
}

type MfaFormValues = {
  mfaPassword: string
  totpCode: string
}

type PasskeyFormValues = {
  passkeyName: string
}

const client = authClient as unknown as AuthClientLoose

export default function AccountsProfilePage() {
  const {
    data: session,
    isPending: isSessionPending,
    refetch,
  } = authClient.useSession()

  const [activeTab, setActiveTab] = useState<TabKey>("profile")
  const [enrollmentTotpUri, setEnrollmentTotpUri] = useState<string | null>(
    null
  )
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const queryClient = useQueryClient()

  const isMfaEnabled = useMemo(() => {
    return Boolean(
      (session?.user as { twoFactorEnabled?: boolean } | undefined)
        ?.twoFactorEnabled
    )
  }, [session?.user])

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
  ]

  const profileForm = useForm<ProfileFormValues>({
    values: {
      name: session?.user?.name ?? "",
      avatarUrl: session?.user?.image ?? "",
    },
  })

  const securityForm = useForm<SecurityFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const mfaForm = useForm<MfaFormValues>({
    defaultValues: {
      mfaPassword: "",
      totpCode: "",
    },
  })

  const passkeyForm = useForm<PasskeyFormValues>({
    defaultValues: {
      passkeyName: "My Device",
    },
  })

  const passkeysQuery = useQuery({
    queryKey: ["account", "passkeys"],
    queryFn: async () => {
      const listPasskeys =
        client.passkey?.listPasskeys ?? client.passkey?.listUserPasskeys

      if (!listPasskeys) {
        throw new Error(
          "Passkey listing is not available in Better Auth client."
        )
      }

      const response = await listPasskeys()

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }

      return (response?.data ?? []).map((item) => ({
        id: item.id,
        name: item.name || "Registered device",
        createdAt: item.createdAt,
      }))
    },
    enabled: !!session,
  })

  const fetchTotpUriMutation = useMutation({
    mutationFn: async () => {
      if (!client.twoFactor?.getTotpUri) {
        throw new Error(
          "TOTP URI retrieval is not available in Better Auth client."
        )
      }

      const password = mfaForm.getValues("mfaPassword")
      const response = await client.twoFactor.getTotpUri(
        password.trim() ? { password } : undefined
      )

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }

      console.log("Fetched TOTP URI:", response?.data?.totpURI)

      const totpURI = response?.data?.totpURI
      if (!totpURI) {
        throw new Error("Unable to get a TOTP URI for QR code generation.")
      }

      return totpURI
    },
    onSuccess: (totpURI) => {
      setEnrollmentTotpUri(totpURI)
      toast.success("QR code loaded. Scan and verify your authenticator code.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const refreshPasskeys = async () => {
    await queryClient.invalidateQueries({ queryKey: ["account", "passkeys"] })
    toast.success("Passkey list refreshed.")
  }

  const profileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!client.updateUser) {
        throw new Error("Update profile is not enabled in Better Auth client.")
      }

      const response = await client.updateUser({
        name: values.name.trim() || undefined,
        image: values.avatarUrl.trim() || undefined,
      })

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }
    },
    onSuccess: async () => {
      await refetch()
      await queryClient.invalidateQueries({ queryKey: ["account", "session"] })
      toast.success("Profile updated successfully.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (values: SecurityFormValues) => {
      if (!client.changePassword) {
        throw new Error("Change password is not enabled in Better Auth client.")
      }

      const response = await client.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      })

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }
    },
    onSuccess: async () => {
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
      })
      await queryClient.invalidateQueries({ queryKey: ["account", "session"] })
      toast.success("Password changed successfully.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const enableMfaMutation = useMutation({
    mutationFn: async () => {
      if (!client.twoFactor?.enable) {
        throw new Error(
          "Two-factor enable is not available in Better Auth client."
        )
      }

      const password = mfaForm.getValues("mfaPassword")
      const response = await client.twoFactor.enable(
        password.trim() ? { password } : undefined
      )

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }

      return response?.data
    },
    onSuccess: async (data) => {
      const uri = data?.totpURI ?? null
      if (uri) {
        setEnrollmentTotpUri(uri)
      }

      setBackupCodes(data?.backupCodes ?? [])
      await queryClient.invalidateQueries({ queryKey: ["account", "mfa"] })
      toast.success("MFA enrollment started. Scan the QR code and verify TOTP.")

      if (!uri) {
        await fetchTotpUriMutation.mutateAsync()
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const verifyTotpMutation = useMutation({
    mutationFn: async () => {
      if (!client.twoFactor?.verifyTotp) {
        throw new Error(
          "TOTP verification is not available in Better Auth client."
        )
      }

      const code = mfaForm.getValues("totpCode").trim()
      if (!code) {
        throw new Error("Enter the authenticator code.")
      }

      const response = await client.twoFactor.verifyTotp({
        code,
        trustDevice: true,
      })

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }
    },
    onSuccess: async () => {
      mfaForm.setValue("totpCode", "")
      setEnrollmentTotpUri(null)
      setBackupCodes([])
      await refetch()
      await queryClient.invalidateQueries({ queryKey: ["account", "mfa"] })
      await queryClient.invalidateQueries({ queryKey: ["account", "session"] })
      toast.success("MFA enabled and verified.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const disableMfaMutation = useMutation({
    mutationFn: async () => {
      if (!client.twoFactor?.disable) {
        throw new Error(
          "Two-factor disable is not available in Better Auth client."
        )
      }

      const password = mfaForm.getValues("mfaPassword")
      const response = await client.twoFactor.disable(
        password.trim() ? { password } : undefined
      )

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }
    },
    onSuccess: async () => {
      setEnrollmentTotpUri(null)
      setBackupCodes([])
      mfaForm.setValue("totpCode", "")
      await refetch()
      await queryClient.invalidateQueries({ queryKey: ["account", "mfa"] })
      await queryClient.invalidateQueries({ queryKey: ["account", "session"] })
      toast.success("MFA disabled.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const registerPasskeyMutation = useMutation({
    mutationFn: async (values: PasskeyFormValues) => {
      const registerPasskey =
        client.passkey?.addPasskey ??
        client.passkey?.create ??
        client.passkey?.register

      if (!registerPasskey) {
        throw new Error(
          "Passkey registration is not enabled in Better Auth client."
        )
      }

      const response = await registerPasskey({
        name: values.passkeyName.trim() || "My Device",
      })

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "passkeys"] })
      toast.success("Passkey registered successfully.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const deletePasskeyMutation = useMutation({
    mutationFn: async (id: string) => {
      const removePasskey =
        client.passkey?.deletePasskey ?? client.passkey?.remove

      if (!removePasskey) {
        throw new Error(
          "Passkey removal is not available in Better Auth client."
        )
      }

      const response = await removePasskey({ id })

      if (response?.error?.message) {
        throw new Error(response.error.message)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "passkeys"] })
      toast.success("Passkey removed.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleProfileSave = async (values: ProfileFormValues) => {
    await profileMutation.mutateAsync(values)
  }

  const handleChangePassword = async (values: SecurityFormValues) => {
    await changePasswordMutation.mutateAsync(values)
  }

  const handleMfaSubmit = async () => {
    if (isMfaEnabled) {
      await disableMfaMutation.mutateAsync()
      return
    }

    await enableMfaMutation.mutateAsync()
  }

  const handleVerifyTotp = async () => {
    await verifyTotpMutation.mutateAsync()
  }

  const handleFetchTotpUri = async () => {
    await fetchTotpUriMutation.mutateAsync()
  }

  const handleRegisterPasskey = async (values: PasskeyFormValues) => {
    await registerPasskeyMutation.mutateAsync(values)
  }

  const handleDeletePasskey = async (id: string) => {
    await deletePasskeyMutation.mutateAsync(id)
  }

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Profile & Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account profile, security settings, and passkeys.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isSessionPending ? (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Loading account...
        </div>
      ) : null}

      {!isSessionPending && activeTab === "profile" ? (
        <Form {...profileForm}>
          <form
            className="rounded-xl border border-border bg-card p-5"
            onSubmit={profileForm.handleSubmit(handleProfileSave)}
          >
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <FormField
                control={profileForm.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input {...field} placeholder="Your full name" />
                    {fieldState.error ? (
                      <p className="text-xs text-destructive">
                        {fieldState.error.message}
                      </p>
                    ) : null}
                  </div>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={session?.user?.email ?? ""}
                  readOnly
                  className="bg-muted/50 text-muted-foreground"
                />
              </div>

              <FormField
                control={profileForm.control}
                name="avatarUrl"
                render={({ field }) => (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Avatar URL</label>
                    <Input
                      {...field}
                      placeholder="https://example.com/avatar.png"
                    />
                  </div>
                )}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                User id: {session?.user?.id || "Unavailable"}
              </p>
              <Button type="submit" size="lg">
                Save profile
              </Button>
            </div>
          </form>
        </Form>
      ) : null}

      {!isSessionPending && activeTab === "security" ? (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <Form {...mfaForm}>
            <form
              className="rounded-lg border border-border p-4"
              onSubmit={mfaForm.handleSubmit(handleMfaSubmit)}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">
                    Multi-factor authentication
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current status: {isMfaEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <Input
                    type="password"
                    {...mfaForm.register("mfaPassword")}
                    className="h-9"
                    placeholder="Current password (if required)"
                  />
                  <Button type="submit" variant="outline" className="h-9">
                    {isMfaEnabled ? "Disable MFA" : "Enable MFA"}
                  </Button>
                </div>

                {!isMfaEnabled ? (
                  <div className="space-y-3 rounded-md border border-dashed border-border p-3">
                    <p className="text-xs text-muted-foreground">
                      Start enrollment, scan the QR in your authenticator app,
                      then verify the code.
                    </p>

                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleFetchTotpUri}
                      >
                        Load QR code
                      </Button>
                    </div>

                    {enrollmentTotpUri ? (
                      <>
                        <div className="inline-block rounded-md bg-white p-2">
                          <QRCode value={enrollmentTotpUri} size={144} />
                        </div>

                        <FormField
                          control={mfaForm.control}
                          name="totpCode"
                          rules={{ required: "Enter the authenticator code" }}
                          render={({ field, fieldState }) => (
                            <div>
                              <Input
                                {...field}
                                inputMode="numeric"
                                maxLength={8}
                                placeholder="Enter authenticator code"
                              />
                              {fieldState.error ? (
                                <p className="mt-1 text-xs text-destructive">
                                  {fieldState.error.message}
                                </p>
                              ) : null}
                            </div>
                          )}
                        />

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleVerifyTotp}
                        >
                          Verify and enable MFA
                        </Button>

                        {backupCodes.length > 0 ? (
                          <div className="space-y-2 rounded-md border border-border p-2">
                            <p className="text-xs font-medium">
                              Backup codes (save these now)
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {backupCodes.map((code) => (
                                <span
                                  key={code}
                                  className="rounded bg-muted px-2 py-1 font-mono"
                                >
                                  {code}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </form>
          </Form>

          <Form {...securityForm}>
            <form
              className="rounded-lg border border-border p-4"
              onSubmit={securityForm.handleSubmit(handleChangePassword)}
            >
              <p className="mb-3 text-sm font-medium">Change password</p>
              <div className="grid gap-3 md:grid-cols-2">
                <FormField
                  control={securityForm.control}
                  name="currentPassword"
                  rules={{ required: "Current password is required" }}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Current password"
                      />
                      {fieldState.error ? (
                        <p className="mt-1 text-xs text-destructive">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                />

                <FormField
                  control={securityForm.control}
                  name="newPassword"
                  rules={{
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "New password must be at least 8 characters",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        type="password"
                        {...field}
                        placeholder="New password"
                      />
                      {fieldState.error ? (
                        <p className="mt-1 text-xs text-destructive">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <Button type="submit" size="lg">
                  Update password
                </Button>
              </div>
            </form>
          </Form>

          <Form {...passkeyForm}>
            <form
              className="rounded-lg border border-border p-4"
              onSubmit={passkeyForm.handleSubmit(handleRegisterPasskey)}
            >
              <p className="mb-3 text-sm font-medium">Register a new passkey</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <FormField
                  control={passkeyForm.control}
                  name="passkeyName"
                  render={({ field }) => (
                    <Input {...field} placeholder="Device name" />
                  )}
                />
                <Button type="submit" className="h-10" size="lg">
                  Register passkey
                </Button>
                <Button
                  type="button"
                  onClick={refreshPasskeys}
                  variant="outline"
                  className="h-10"
                  size="lg"
                >
                  Refresh list
                </Button>
              </div>
            </form>
          </Form>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 text-sm font-medium">Your passkeys</p>
            {passkeysQuery.isPending ? (
              <p className="text-sm text-muted-foreground">
                Loading passkeys...
              </p>
            ) : passkeysQuery.error ? (
              <p className="text-sm text-destructive">
                {(passkeysQuery.error as Error).message}
              </p>
            ) : (passkeysQuery.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">
                No passkeys listed yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {(passkeysQuery.data ?? []).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : item.id}
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleDeletePasskey(item.id)}
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </section>
  )
}
