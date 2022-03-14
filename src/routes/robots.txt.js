export function get (req, res) {
    res.setHeader('Content-Type', 'text/plain')

    res.end(`User-agent: *
Allow: /`)
}