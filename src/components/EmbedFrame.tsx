interface Props {
    url: string
    title: string
}

export function EmbedFrame({ url, title }: Props) {
    return (
        <iframe
            src={url}
            title={title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-[70vh] w-full border-0"
        />
    )
}