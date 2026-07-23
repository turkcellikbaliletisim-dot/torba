/**
 * TORBAA SMS Gateway Service
 * Uses Netgsm HTTP POST JSON API (Credentials in body, not URL query params).
 * Supports fallback to development console log when SMS credentials are not configured.
 */

export interface SmsSendOptions {
  toPhone: string;
  messageText: string;
}

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  provider: 'NETGSM' | 'TWILIO' | 'DEV_MOCK';
  error?: string;
}

const SMS_PROVIDER = process.env.SMS_PROVIDER || 'DEV_MOCK';
const NETGSM_USER = process.env.NETGSM_USER;
const NETGSM_PASS = process.env.NETGSM_PASS;
const NETGSM_HEADER = process.env.NETGSM_HEADER || 'TORBAA';

export async function sendSms(options: SmsSendOptions): Promise<SmsSendResult> {
  const cleanPhone = options.toPhone.replace(/[^0-9]/g, '');

  if (SMS_PROVIDER === 'NETGSM' && NETGSM_USER && NETGSM_PASS) {
    try {
      const payload = {
        header: {
          company: NETGSM_HEADER,
          usercode: NETGSM_USER,
          password: NETGSM_PASS,
          type: '1:n',
          msgheader: NETGSM_HEADER,
        },
        body: {
          msg: options.messageText,
          no: [cleanPhone],
        },
      };

      const res = await fetch('https://api.netgsm.com.tr/sms/send/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (res.ok && text.includes('00')) {
        return {
          success: true,
          messageId: text.trim(),
          provider: 'NETGSM',
        };
      } else {
        return {
          success: false,
          error: `Netgsm HTTP Error: ${text}`,
          provider: 'NETGSM',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Netgsm baglanti hatasi',
        provider: 'NETGSM',
      };
    }
  }

  // Development Fallback
  console.log(`[SMS MOCK SEND] To: ${cleanPhone} | Message: "${options.messageText}"`);
  return {
    success: true,
    messageId: `mock-sms-${Date.now()}`,
    provider: 'DEV_MOCK',
  };
}
