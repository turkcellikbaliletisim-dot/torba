package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
)

// QrTokenPayload represents the decoded QR payload
type QrTokenPayload struct {
	IntentID    string `json:"i"`
	UserID      string `json:"u"`
	BranchID    string `json:"b"`
	AmountMinor string `json:"a"`
	ExpiresAtMs int64  `json:"e"`
	Signature   string `json:"s"`
}

var qrSecretKey = []byte("torbaa_secure_qr_secret_key_2026_prod")

func main() {
	http.HandleFunc("/fastpath/qr/verify", verifyHandler)
	http.HandleFunc("/health", healthHandler)

	fmt.Println("🚀 TORBAA Go Ultra-Fastpath QR Verification Service listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"HEALTHY","engine":"Go-Fastpath-v1"}`))
}

func verifyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		QrToken string `json:"qrToken"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.QrToken == "" {
		http.Error(w, `{"success":false,"error":"Invalid JSON payload"}`, http.StatusBadRequest)
		return
	}

	// Base64URL decode
	decodedBytes, err := base64.RawURLEncoding.DecodeString(body.QrToken)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnprocessableEntity)
		w.Write([]byte(`{"success":false,"error":"Malformed Base64URL token"}`))
		return
	}

	var payload QrTokenPayload
	if err := json.Unmarshal(decodedBytes, &payload); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnprocessableEntity)
		w.Write([]byte(`{"success":false,"error":"Invalid token schema"}`))
		return
	}

	// 1. Expiration check
	nowMs := time.Now().UnixNano() / int64(time.Millisecond)
	if nowMs > payload.ExpiresAtMs {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnprocessableEntity)
		w.Write([]byte(`{"success":false,"error":"QR code expired"}`))
		return
	}

	// 2. O(1) CPU HMAC-SHA256 signature verification
	dataToSign := fmt.Sprintf("%s:%s:%s:%s:%d",
		payload.IntentID, payload.UserID, payload.BranchID, payload.AmountMinor, payload.ExpiresAtMs)

	h := hmac.New(sha256.New, qrSecretKey)
	h.Write([]byte(dataToSign))
	expectedSig := hex.EncodeToString(h.Sum(nil))[:16]

	if !hmac.Equal([]byte(payload.Signature), []byte(expectedSig)) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnprocessableEntity)
		w.Write([]byte(`{"success":false,"error":"HMAC Signature Mismatch"}`))
		return
	}

	amountMinor, _ := strconv.ParseInt(payload.AmountMinor, 10, 64)

	resp, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"intentId":    payload.IntentID,
			"userId":      payload.UserID,
			"branchId":    payload.BranchID,
			"amountMinor": amountMinor,
			"verifiedBy":  "Go-Fastpath-v1",
		},
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}
