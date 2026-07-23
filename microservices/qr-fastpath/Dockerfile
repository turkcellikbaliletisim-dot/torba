FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY main.go ./
RUN go env -w GO111MODULE=off
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o qr-fastpath .

FROM scratch
COPY --from=builder /app/qr-fastpath /qr-fastpath
EXPOSE 8080
ENTRYPOINT ["/qr-fastpath"]
