/**
 * AFTERSHOP — Modern POS & Retail Management Platform
 * Enterprise Frontend Controller
 * Parent Company: AFTERSHOP by Trawbit Technologies
 */

(function () {
  'use strict';

  /* =========================================================================
     1. Toast Notification System
     ========================================================================= */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info', duration = 4500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <div style="flex:1;line-height:1.4;">${message}</div>
      <button style="color:var(--secondary-text);font-size:14px;padding:2px 4px;background:none;border:none;cursor:pointer;" aria-label="Dismiss">✕</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => removeToast(toast));

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const timer = setTimeout(() => {
      removeToast(toast);
    }, duration);

    function removeToast(el) {
      clearTimeout(timer);
      el.classList.remove('show');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }
  }
  window.showToast = showToast;

  /* =========================================================================
     2. Sticky Header & Navigation
     ========================================================================= */
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking an anchor
    navLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Handle mobile sub-menu expand
    document.querySelectorAll('.nav-item').forEach(item => {
      const btn = item.querySelector('.nav-link');
      if (btn && item.querySelector('.dropdown-menu')) {
        btn.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            item.classList.toggle('active');
          }
        });
      }
    });
  }

  // Live Hero Clock
  const heroClock = document.getElementById('heroClock');
  if (heroClock) {
    function updateClock() {
      const now = new Date();
      heroClock.textContent = now.toTimeString().split(' ')[0];
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Sign In Mock Button
  const navSignInBtn = document.getElementById('navSignInBtn');
  if (navSignInBtn) {
    navSignInBtn.addEventListener('click', () => {
      showToast('Authentication Environment: Use Start Free to explore all active features.', 'info');
    });
  }

  /* =========================================================================
     3. Interactive Hero POS Simulator
     ========================================================================= */
  let simulatedSalesTotal = 42850;
  let simulatedOrdersCount = 124;
  let simulatedOrderSequence = 8943;

  const heroSimulateSaleBtn = document.getElementById('heroSimulateSaleBtn');
  const heroSimulateScanBtn = document.getElementById('heroSimulateScanBtn');
  const heroTodaySales = document.getElementById('heroTodaySales');
  const heroCompletedOrders = document.getElementById('heroCompletedOrders');
  const posTxList = document.getElementById('posTxList');

  if (heroSimulateSaleBtn) {
    heroSimulateSaleBtn.addEventListener('click', () => {
      const saleAmount = 850;
      simulatedSalesTotal += saleAmount;
      simulatedOrdersCount += 1;
      const orderId = `AS-${simulatedOrderSequence++}`;

      if (heroTodaySales) {
        heroTodaySales.textContent = `₹${simulatedSalesTotal.toLocaleString('en-IN')}`;
        heroTodaySales.style.color = 'var(--primary-accent)';
        setTimeout(() => { heroTodaySales.style.color = ''; }, 600);
      }
      if (heroCompletedOrders) {
        heroCompletedOrders.textContent = simulatedOrdersCount;
        heroCompletedOrders.style.color = 'var(--primary-accent)';
        setTimeout(() => { heroCompletedOrders.style.color = ''; }, 600);
      }

      if (posTxList) {
        const newTx = document.createElement('div');
        newTx.className = 'tx-row';
        newTx.innerHTML = `
          <div class="tx-left">
            <span class="tx-badge upi">UPI</span>
            <div>
              <div class="tx-meta-title">Order #${orderId}</div>
              <div class="tx-meta-time">Just now · 2 items</div>
            </div>
          </div>
          <div>
            <div class="tx-amount">₹${saleAmount}</div>
            <span class="tx-status">● Paid</span>
          </div>
        `;
        posTxList.insertBefore(newTx, posTxList.firstChild);
        if (posTxList.children.length > 3) {
          posTxList.removeChild(posTxList.lastChild);
        }
      }

      showToast(`⚡ Live POS: Order #${orderId} completed for ₹${saleAmount} via UPI! Register synced.`, 'success', 4000);
    });
  }

  if (heroSimulateScanBtn) {
    heroSimulateScanBtn.addEventListener('click', () => {
      const skus = ['SKU-8921 (Arabica Beans 1kg)', 'SKU-4412 (Organic Almond Milk)', 'SKU-7703 (Type-C Cable 2m)'];
      const randomSku = skus[Math.floor(Math.random() * skus.length)];
      showToast(`📷 Barcode Scanned: [8901030${Math.floor(10000 + Math.random()*90000)}] → Added ${randomSku} to current checkout basket.`, 'info', 4000);
    });
  }

  /* =========================================================================
     4. Interactive Industry Verticals Selector
     ========================================================================= */
  const industryPills = document.querySelectorAll('.industry-btn');
  const industryPanel = document.getElementById('industryPanel');

  const industryProfiles = {
    grocery: {
      title: "Grocery & Convenience Stores",
      desc: "High volume, fast checkout, weighing scale integration, and perishable stock controls tailored for busy grocery stores.",
      features: [
        "Digital weighing scale sync (RS232/USB)",
        "Packaged & loose item barcodes",
        "Expiry date & shelf-life tracking",
        "Fast tender cash & split UPI checkout"
      ],
      codeSnippet: `// Grocery Scale & Barcode Reader
ScaleInterface.onWeightStable((weightKg) => {
  POS.addLineItem({
    sku: "GROC-VEG-401",
    name: "Organic Tomatoes",
    qtyKg: weightKg,
    pricePerKg: 40.00
  });
});`
    },
    fashion: {
      title: "Fashion & Apparel Boutiques",
      desc: "Manage matrix variants (Size, Color, Fit, Fabric) with seasonal collections and customized garment tags.",
      features: [
        "Matrix variant grid (S/M/L/XL × Colors)",
        "Seasonal discount rules & Buy-1-Get-1",
        "Garment tag & barcode printing",
        "Customer profile & styling records"
      ],
      codeSnippet: `// Variant Matrix Architecture
ItemMatrix.generateSKU({
  brand: "VogueLine",
  style: "Slim Linen Trouser",
  sizes: ["30", "32", "34", "36"],
  colors: ["Navy", "Beige", "Charcoal"]
}); // Automatically generates 12 SKUs`
    },
    electronics: {
      title: "Electronics & Mobile Retailers",
      desc: "Track serial numbers, IMEIs, manufacturer warranty periods, and accessory bundles with high-ticket fraud protection.",
      features: [
        "Serial & IMEI capture at checkout",
        "Warranty card & service history",
        "Component bundle pricing",
        "Trade-in exchange calculation"
      ],
      codeSnippet: `// IMEI & Warranty Verification
POS.scanSerial("IMEI-864920048192847", {
  validateWarranty: true,
  manufacturer: "Samsung Electronics",
  servicePeriodMonths: 24
});`
    },
    pharmacy: {
      title: "Pharmacies & Healthcare Stores",
      desc: "Strict batch number tracking, drug expiry alerts, prescription attachments, and schedule drug compliance.",
      features: [
        "Batch number & expiry management",
        "Prescription image upload & filing",
        "Generic substitute lookup",
        "Automated drug recall alerts"
      ],
      codeSnippet: `// Batch & Expiry Validation
PharmacyEngine.verifyBatch({
  drugCode: "PARACETAMOL-650",
  batchNo: "BT-2026-X4",
  expiryDate: "2027-08-31",
  schedule: "H1"
});`
    },
    hardware: {
      title: "Hardware, Paints & Building Supply",
      desc: "Unit of measure conversions (meters, kg, bundles), contractor credit ledgers, and tint mixing code storage.",
      features: [
        "Multiple units of measurement (UOM)",
        "Contractor credit & debit ledgers",
        "Custom paint tint code database",
        "Bulk wholesale tiered discounts"
      ],
      codeSnippet: `// Dual Unit Conversion
Inventory.depleteUnits({
  sku: "STEEL-REBAR-12MM",
  weightMetricTons: 1.45,
  convertedPieces: 85
});`
    },
    furniture: {
      title: "Furniture & Home Decor Showrooms",
      desc: "Handle custom made-to-order requests, partial advance deposits, split delivery schedules, and dimension notes.",
      features: [
        "Custom order deposits & milestones",
        "Delivery & assembly dispatch logs",
        "Fabric & wood finish variants",
        "High-value quotation generator"
      ],
      codeSnippet: `// Advance Deposit & Split Invoicing
OrderManager.createCustomOrder({
  item: "Nordic 6-Seater Dining Oak",
  totalQuote: 58000,
  advancePaid: 20000,
  balanceOnDelivery: 38000
});`
    },
    beauty: {
      title: "Beauty, Cosmetics & Salons",
      desc: "Shade match records, allergy warnings, membership packages, and therapist appointment commission tracking.",
      features: [
        "Shade & skin-type customer notes",
        "Membership package redemptions",
        "Staff service commission tracker",
        "Digital appointment logs"
      ],
      codeSnippet: `// Customer Profile & Beauty Notes
CustomerDB.updateAttributes("CUST-901", {
  skinTone: "Warm Honey",
  allergies: ["Fragrance-oil"],
  loyaltyTier: "Diamond Glam"
});`
    },
    wholesale: {
      title: "Wholesale & B2B Distribution",
      desc: "Carton & pallet packaging, customer-specific price lists, credit terms (Net 30/60), and GST E-Way Bill generation.",
      features: [
        "Carton, master-box & pallet levels",
        "Customer-tier contracted pricing",
        "Credit limit & overdue collection lock",
        "E-Way Bill & B2B GSTIN compliance"
      ],
      codeSnippet: `// B2B Wholesale Tier Pricing
WholesalePricing.getPrice({
  customerTier: "Distributor-A",
  moqCartons: 50,
  gstin: "32AAAAA0000A1Z5"
});`
    },
    supermarket: {
      title: "Supermarkets & Hypermarkets",
      desc: "Multi-register lane synchronization, conveyor scale speed, cashier float audit, and barcode throughput.",
      features: [
        "10+ POS lane concurrency sync",
        "Promotions & volume bundle engine",
        "Supervisor approval remote override",
        "Zero-latency barcode scanning"
      ],
      codeSnippet: `// Multi-Lane Cluster Sync
SupermarketCluster.syncAllLanes({
  masterPromotion: "SuperSaver Weekend 15%",
  syncTimestamp: Date.now()
});`
    },
    restaurant: {
      title: "Restaurants & Quick-Serve Cafes",
      desc: "Kitchen Display System (KDS), table management, modifier options (sugar, milk type), and bill splitting.",
      features: [
        "Kitchen Order Ticket (KOT) routing",
        "Recipe ingredient inventory depletion",
        "Add-ons & modifier customization",
        "Table occupancy & takeaway queues"
      ],
      codeSnippet: `// KOT Kitchen Dispatch
KDS.dispatch({
  table: "Table 04",
  items: [
    { item: "Oat Latte", modifier: "Extra Shot" },
    { item: "Avocado Toast", modifier: "Gluten-Free" }
  ]
});`
    }
  };

  function updateIndustryPanel(indKey) {
    if (!industryPanel || !industryProfiles[indKey]) return;

    const data = industryProfiles[indKey];

    industryPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-ind') === indKey);
    });

    industryPanel.style.opacity = '0';
    setTimeout(() => {
      industryPanel.innerHTML = `
        <div class="ind-info">
          <div class="section-eyebrow">${indKey.toUpperCase()} SPECIALIZATION</div>
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <ul class="ind-features-list">
            ${data.features.map(f => `<li><span style="color:var(--primary-accent);font-weight:700;">✓</span> ${f}</li>`).join('')}
          </ul>
        </div>
        <div class="ind-code-box">
          <div class="ind-code-title">Engine Workflow Execution</div>
          <pre><code>${data.codeSnippet}</code></pre>
        </div>
      `;
      industryPanel.style.opacity = '1';
    }, 150);
  }

  industryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const ind = pill.getAttribute('data-ind');
      if (ind) updateIndustryPanel(ind);
    });
  });

  // Handle header dropdown industry triggers
  document.querySelectorAll('.industry-nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const ind = trigger.getAttribute('data-ind');
      if (ind) {
        updateIndustryPanel(ind);
        document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial industry render
  updateIndustryPanel('grocery');

  /* =========================================================================
     5. Dynamic Pricing Toggle (Monthly vs Annual)
     ========================================================================= */
  const pricingToggle = document.getElementById('pricingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  const planAmounts = document.querySelectorAll('.plan-amount');
  const planPeriods = document.querySelectorAll('.plan-period');

  let isAnnualBilling = false;

  function updatePricing() {
    isAnnualBilling = pricingToggle ? pricingToggle.checked : false;

    monthlyLabel?.classList.toggle('active', !isAnnualBilling);
    annualLabel?.classList.toggle('active', isAnnualBilling);

    planAmounts.forEach(el => {
      const monthly = el.getAttribute('data-monthly');
      const annual = el.getAttribute('data-annual');
      el.textContent = isAnnualBilling ? annual : monthly;
    });

    planPeriods.forEach(el => {
      el.textContent = isAnnualBilling ? '/year' : '/month';
    });
  }

  if (pricingToggle) {
    pricingToggle.addEventListener('change', updatePricing);
  }

  /* =========================================================================
     6. Modals Architecture (Checkout, Demo, Enquiry)
     ========================================================================= */
  const checkoutModal = document.getElementById('checkoutModal');
  const demoModal = document.getElementById('demoModal');
  const enquiryModal = document.getElementById('enquiryModal');
  const allModals = [checkoutModal, demoModal, enquiryModal];

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    const hasOpen = allModals.some(m => m?.classList.contains('open'));
    if (!hasOpen) {
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    modal.querySelectorAll('.close-modal-trigger').forEach(btn => {
      btn.addEventListener('click', () => closeModal(modal));
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(m => closeModal(m));
    }
  });

  // Open Checkout Modal triggers
  const checkoutButtons = document.querySelectorAll('.open-checkout-btn');
  const modalSummaryPlan = document.getElementById('modalSummaryPlan');
  const modalSummaryCycle = document.getElementById('modalSummaryCycle');
  const modalSummaryTotal = document.getElementById('modalSummaryTotal');
  const checkoutPlanSelect = document.getElementById('checkoutPlanSelect');
  const checkoutCycleSelect = document.getElementById('checkoutCycleSelect');

  function syncCheckoutSummary() {
    const plan = checkoutPlanSelect?.value || 'Growth';
    const cycle = checkoutCycleSelect?.value || (isAnnualBilling ? 'annual' : 'monthly');

    if (checkoutCycleSelect) {
      checkoutCycleSelect.value = cycle;
    }

    if (modalSummaryPlan) modalSummaryPlan.textContent = `${plan} Plan`;
    if (modalSummaryCycle) modalSummaryCycle.textContent = cycle === 'annual' ? 'Billed Annually (Save 20%)' : 'Billed Monthly';

    let totalText = '₹1,999 / month';
    if (plan === 'Starter') {
      totalText = cycle === 'annual' ? '₹9,590 / year' : '₹999 / month';
    } else if (plan === 'Growth') {
      totalText = cycle === 'annual' ? '₹19,190 / year' : '₹1,999 / month';
    } else if (plan === 'Enterprise') {
      totalText = cycle === 'annual' ? '₹47,990 / year' : '₹4,999 / month';
    }

    if (modalSummaryTotal) modalSummaryTotal.textContent = totalText;
  }

  checkoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenPlan = btn.getAttribute('data-plan') || 'Growth';
      if (checkoutPlanSelect) {
        checkoutPlanSelect.value = chosenPlan;
      }
      if (checkoutCycleSelect) {
        checkoutCycleSelect.value = isAnnualBilling ? 'annual' : 'monthly';
      }
      syncCheckoutSummary();
      openModal(checkoutModal);
    });
  });

  checkoutPlanSelect?.addEventListener('change', syncCheckoutSummary);
  checkoutCycleSelect?.addEventListener('change', syncCheckoutSummary);

  const checkoutForm = document.getElementById('checkoutForm');
  checkoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const bName = document.getElementById('checkoutBusiness')?.value || 'Your Store';
    showToast(`Free trial registered for "${bName}". Setup email will be sent shortly.`, 'success', 6000);
    closeModal(checkoutModal);
    checkoutForm.reset();
  });

  // Demo Booking Modal
  const openDemoButtons = document.querySelectorAll('.open-demo-btn');
  openDemoButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(demoModal));
  });

  const demoBookingForm = document.getElementById('demoBookingForm');
  demoBookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const demoDate = document.getElementById('demoDate')?.value;
    const demoTime = document.getElementById('demoTime')?.value;

    showToast(`Demo booked! Our retail architect will present on ${demoDate || 'scheduled date'} at ${demoTime}.`, 'success', 6000);
    closeModal(demoModal);
    demoBookingForm.reset();
  });

  // Contact Sales button
  document.querySelectorAll('.open-contact-sales-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      showToast('Fill in the enquiry form or email sales@aftershop.com to connect directly with sales.', 'info');
    });
  });

  // Floating Enquiry Button & Modal
  const floatingEnquiryBtn = document.getElementById('floatingEnquiryBtn');
  floatingEnquiryBtn?.addEventListener('click', () => openModal(enquiryModal));

  const quickEnquiryForm = document.getElementById('quickEnquiryForm');
  quickEnquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const enquiryId = `ENQ-${randomDigits}`;

    const savedEnquiries = JSON.parse(localStorage.getItem('aftershop_enquiries') || '[]');
    savedEnquiries.push({
      id: enquiryId,
      name: document.getElementById('enqName')?.value,
      business: document.getElementById('enqBusiness')?.value,
      created: new Date().toISOString()
    });
    localStorage.setItem('aftershop_enquiries', JSON.stringify(savedEnquiries));

    showToast(`Enquiry submitted! Reference ID: ${enquiryId}. Our team will contact you shortly.`, 'success', 6500);
    closeModal(enquiryModal);
    quickEnquiryForm.reset();
  });

  /* =========================================================================
     7. Support Ticket Desk (Submission & Real-time Tracking)
     ========================================================================= */
  const ticketSubmitForm = document.getElementById('ticketSubmitForm');
  const ticketTrackForm = document.getElementById('ticketTrackForm');
  const trackTicketIdInput = document.getElementById('trackTicketId');
  const trackResultBox = document.getElementById('trackResultBox');

  const seedTickets = {
    'AS-10482': {
      id: 'AS-10482',
      name: 'Retail Partner',
      subject: 'Thermal Printer Driver Setup (Epson TM-T82III)',
      category: 'Hardware Integration',
      priority: 'Medium',
      status: 'In Progress',
      note: 'Our hardware support desk has reviewed the ESC/POS driver compatibility for Register #2.'
    }
  };

  function getStoredTickets() {
    try {
      const stored = localStorage.getItem('aftershop_tickets');
      return stored ? { ...seedTickets, ...JSON.parse(stored) } : seedTickets;
    } catch {
      return seedTickets;
    }
  }

  function saveStoredTicket(ticket) {
    try {
      const tickets = getStoredTickets();
      tickets[ticket.id] = ticket;
      localStorage.setItem('aftershop_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  ticketSubmitForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dynamicId = `AS-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket = {
      id: dynamicId,
      name: document.getElementById('ticketName')?.value,
      email: document.getElementById('ticketEmail')?.value,
      category: document.getElementById('ticketCategory')?.value,
      priority: document.getElementById('ticketPriority')?.value,
      subject: document.getElementById('ticketSubject')?.value,
      desc: document.getElementById('ticketDesc')?.value,
      status: 'In Progress',
      note: 'Ticket received and queued for review by our retail operations desk.'
    };

    saveStoredTicket(newTicket);
    showToast(`Ticket #${dynamicId} created successfully. Keep this ID for tracking.`, 'success', 6500);

    if (trackTicketIdInput) {
      trackTicketIdInput.value = dynamicId;
    }
    ticketSubmitForm.reset();
  });

  ticketTrackForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!trackTicketIdInput || !trackResultBox) return;

    let id = trackTicketIdInput.value.trim().toUpperCase();
    if (!id.startsWith('AS-') && !id.startsWith('#AS-')) {
      id = `AS-${id}`;
    }
    id = id.replace('#', '');

    const tickets = getStoredTickets();
    const found = tickets[id];

    trackResultBox.classList.add('active');

    if (found) {
      trackResultBox.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <strong style="color:var(--primary);font-size:15px;">Ticket #${found.id}</strong>
          <span style="font-size:12px;font-weight:600;padding:2px 8px;border-radius:9999px;background:var(--accent-subtle);color:var(--primary-accent);">● ${found.status}</span>
        </div>
        <div style="font-size:13px;color:var(--secondary-text);display:flex;flex-direction:column;gap:6px;">
          <div><strong>Subject:</strong> ${found.subject}</div>
          <div><strong>Category:</strong> ${found.category} | <strong>Priority:</strong> <span style="color:var(--primary);">${found.priority}</span></div>
          <div style="margin-top:8px;padding:10px;background:var(--surface-alt);border-radius:var(--radius-sm);border:1px solid var(--border);color:var(--main-text);">
            <strong>Desk Note:</strong> ${found.note}
          </div>
        </div>
      `;
      showToast(`Found status for Ticket #${found.id}`, 'info');
    } else {
      trackResultBox.innerHTML = `
        <div style="color:var(--warning);font-weight:600;font-size:14px;margin-bottom:6px;">
          Ticket #${id} Not Found
        </div>
        <p style="font-size:13px;color:var(--secondary-text);">
          Please verify your reference number. You can test with sample ticket <strong>AS-10482</strong> or submit a new ticket on the left.
        </p>
      `;
    }
  });

  /* =========================================================================
     8. Contact Enquiry Form
     ========================================================================= */
  const contactEnquiryForm = document.getElementById('contactEnquiryForm');
  contactEnquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you! Your enquiry has been received. Our sales team will get back to you shortly.', 'success', 6000);
    contactEnquiryForm.reset();
  });

  /* =========================================================================
     9. FAQ Accordion
     ========================================================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          const otherAnswer = other.querySelector('.faq-answer');
          otherBtn?.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      } else {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        if (answer) {
          answer.style.maxHeight = null;
        }
      }
    });
  });

  // Open first FAQ by default
  if (faqItems[0]) {
    const firstBtn = faqItems[0].querySelector('.faq-question');
    const firstAns = faqItems[0].querySelector('.faq-answer');
    faqItems[0].classList.add('active');
    firstBtn?.setAttribute('aria-expanded', 'true');
    if (firstAns) {
      firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
    }
  }

  /* =========================================================================
     10. Console Branding
     ========================================================================= */
  console.log(
    '%c AFTERSHOP %c Beyond Every Sale. by Trawbit Technologies %c',
    'background:#0B0F19;color:#FFFFFF;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;',
    'background:#2563EB;color:#FFFFFF;font-weight:bold;padding:4px 8px;border-radius:0 4px 4px 0;',
    'color:inherit;'
  );

})();
