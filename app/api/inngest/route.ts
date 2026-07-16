import { serve } from "inngest/next"

import { newsletterCampaignSendFunction } from "@/lib/inngest/functions/newsletter"
import { inngest } from "@/lib/inngest/client"

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [newsletterCampaignSendFunction],
})
