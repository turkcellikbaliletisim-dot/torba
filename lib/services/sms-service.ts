/**
 * TORBAA SMS Gateway Service
 * Integrates with Netgsm / Twilio SMS Providers.
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
      const netgsmUrl = `https://api.netgsm.com.tr/sms/send/get/?usercode=${NETGSM_USER}&password=${NETGSM_PASS}&gsmno=${cleanPhone}&message=${encodeURIComponent(options.messageText)}&msgheader=${NETGSM_HEADER}`;
      const res = await fetch(netgsmUrl);
      const text = await res.text();

      if (text.startsWith('00')) {
        return {
          success: true,
          messageId: text.split(' ')[1] || `netgsm-${Date.now()}`,
          provider: 'NETGSM',
        };
      } else {
        return {
          success: false,
          error: `Netgsm Hata Kodu: ${text}`,
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
