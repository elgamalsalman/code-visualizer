class HeaderableWebSocket extends WebSocket {
  constructor(url, header, protocol = "protocol") {
    const encoded_header = btoa(encodeURIComponent(JSON.stringify(header)))
      .replace(/\//g, "-")
      .replace(/=+$/, "");
    const protocols = [protocol, encoded_header];
    super(url, protocols);
  }
}

export default HeaderableWebSocket;
