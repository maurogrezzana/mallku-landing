import { PostHog } from 'posthog-node';

let posthog: PostHog | null = null;

export function initPosthog(apiKey: string) {
  posthog = new PostHog(apiKey, {
    host: 'https://app.posthog.com',
    flushAt: 1, // Send events immediately in serverless
    flushInterval: 0,
  });
}

export function getPosthog(): PostHog | null {
  return posthog;
}

// ==========================================
// TRACKING FUNCTIONS
// ==========================================

export interface TrackingEvent {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}

export function trackEvent(event: TrackingEvent): void {
  if (!posthog) {
    console.warn('Posthog not initialized');
    return;
  }

  posthog.capture({
    distinctId: event.distinctId,
    event: event.event,
    properties: {
      ...event.properties,
      source: 'mallku-api',
      timestamp: new Date().toISOString(),
    },
  });
}

export function identifyUser(distinctId: string, properties: Record<string, unknown>): void {
  if (!posthog) {
    console.warn('Posthog not initialized');
    return;
  }

  posthog.identify({
    distinctId,
    properties,
  });
}

// ==========================================
// PREDEFINED EVENTS
// ==========================================

export function trackLeadCreated(
  sessionId: string,
  leadData: { email: string; excursion?: string; source?: string }
): void {
  trackEvent({
    distinctId: sessionId,
    event: 'lead_created',
    properties: {
      email: leadData.email,
      excursion_interest: leadData.excursion,
      source: leadData.source,
    },
  });
}

export function trackBookingCreated(
  sessionId: string,
  bookingData: {
    bookingNumber: string;
    excursion: string;
    personas: number;
    total: number
  }
): void {
  trackEvent({
    distinctId: sessionId,
    event: 'booking_created',
    properties: {
      booking_number: bookingData.bookingNumber,
      excursion: bookingData.excursion,
      cantidad_personas: bookingData.personas,
      precio_total: bookingData.total,
    },
  });
}

export function trackPageView(
  sessionId: string,
  pageData: { url: string; referrer?: string; title?: string }
): void {
  trackEvent({
    distinctId: sessionId,
    event: '$pageview',
    properties: {
      $current_url: pageData.url,
      $referrer: pageData.referrer,
      $title: pageData.title,
    },
  });
}

export function trackFormSubmit(
  sessionId: string,
  formData: { formId: string; formName: string; page: string }
): void {
  trackEvent({
    distinctId: sessionId,
    event: 'form_submitted',
    properties: {
      form_id: formData.formId,
      form_name: formData.formName,
      page: formData.page,
    },
  });
}

export async function shutdown(): Promise<void> {
  if (posthog) {
    await posthog.shutdown();
  }
}
