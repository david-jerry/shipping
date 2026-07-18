import type { Metadata } from "next"

const fallbackSiteUrl = "https://jeremiahdavid.online"

export const siteUrl = (() => {
    const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    if (!configured) {
        return fallbackSiteUrl
    }

    if (configured.startsWith("http://") || configured.startsWith("https://")) {
        return configured
    }

    return `https://${configured}`
})()

export const siteName = "Lyftberan"

export function toAbsoluteUrl(path: string) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return new URL(normalizedPath, siteUrl).toString()
}

const defaultOgImage = toAbsoluteUrl("/opengraph-image")
const defaultTwitterImage = toAbsoluteUrl("/twitter-image")

type BuildMarketingMetadataInput = {
    title: string
    description: string
    path: string
    keywords?: string[]
    noIndex?: boolean
}

export function buildMarketingMetadata({
    title,
    description,
    path,
    keywords,
    noIndex = false,
}: BuildMarketingMetadataInput): Metadata {
    const canonical = toAbsoluteUrl(path)

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName,
            type: "website",
            locale: "en_US",
            images: [
                {
                    url: defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: "Lyftberan logistics platform",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [defaultTwitterImage],
        },
        robots: noIndex
            ? {
                index: false,
                follow: false,
                nocache: true,
                googleBot: {
                    index: false,
                    follow: false,
                    noimageindex: true,
                },
            }
            : {
                index: true,
                follow: true,
            },
    }
}