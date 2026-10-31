"use client";

import Script from "next/script";
import { useEffect } from "react";
import { captureLandingParams, ensureVisitorId } from "@/lib/tracking";
import { QUALIFY_STORAGE_KEY } from "@/lib/qualify";

/**
 * Base analytics tags — GA4, Meta Pixel and MS Clarity. Each renders only when
 * its env id is set. First-touch UTM/fbclid capture + the kwk_vid visitor id
 * run on mount.
 *
 * META: the Pixel fires PageView here; the four conversion events (AddToCart,
 * Lead, QualifiedLead, Schedule) are fired from src/lib/tracking.ts through
 * BOTH the Pixel and CAPI with a shared event id, so Meta dedupes each pair.
 *
 * Advanced matching: when this session has already submitted the opt-in form
 * (the kwk_qualify stash — e.g. on /book-a-call, where Schedule fires), the
 * Pixel is initialised with the applicant's email, phone, first/last name and
 * country. The Pixel hashes these itself before sending; nothing new is stored.
 */
export function Analytics() {
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;

  useEffect(() => {
    captureLandingParams();
    ensureVisitorId();
  }, []);

  return (
    <>
      {ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4}');`}
          </Script>
        </>
      )}

      {pixel && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');var am={};try{var d=JSON.parse(sessionStorage.getItem('${QUALIFY_STORAGE_KEY}')||'null');if(d&&d.email){am.em=String(d.email).trim().toLowerCase();if(d.whatsapp)am.ph=String(d.whatsapp).replace(/\\D/g,'');if(d.firstName)am.fn=String(d.firstName).trim().toLowerCase();if(d.lastName)am.ln=String(d.lastName).trim().toLowerCase();if(d.countryCode)am.country=String(d.countryCode).trim().toLowerCase();}}catch(e){}fbq('init','${pixel}',am);fbq('track','PageView');`}
        </Script>
      )}

      {clarity && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarity}");`}
        </Script>
      )}
    </>
  );
}
