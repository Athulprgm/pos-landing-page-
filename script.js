/**
 * AFTERSHOP — Modern POS & Retail Management Software
 * Master Frontend Controller & Mock Interactive Engine
 * 
 * Note: Designed cleanly so backend REST/GraphQL APIs and payment
 * gateways can replace mock services without restructuring the UI.
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
    
    // Choose icon
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <div style="flex:1;line-height:1.4;">${message}</div>
      <button style="color:var(--muted);font-size:14px;padding:2px 4px;" aria-label="Dismiss">✕</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => removeToast(toast));

    toastContainer.appendChild(toast);

    // Trigger animation
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
     2. Sticky Header & Mobile Menu
     ========================================================================= */
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuToggle.classList.toggle('open', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking nav anchor
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuToggle.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
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
      showToast('Demo Environment: Authentication is simulated. Use Start Free to explore full features.', 'info');
    });
  }

  // Interactive Live Hero POS Simulator
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
        heroTodaySales.style.color = 'var(--accent)';
        setTimeout(() => { heroTodaySales.style.color = ''; }, 600);
      }
      if (heroCompletedOrders) {
        heroCompletedOrders.textContent = simulatedOrdersCount;
        heroCompletedOrders.style.color = 'var(--accent)';
        setTimeout(() => { heroCompletedOrders.style.color = ''; }, 600);
      }

      if (posTxList) {
        const newTx = document.createElement('div');
        newTx.className = 'pos-tx-row';
        newTx.style.animation = 'fadeInMsg 0.3s ease';
        newTx.innerHTML = `
          <div class="tx-info">
            <div class="tx-icon-badge tx-icon-upi">UPI</div>
            <div>
              <div class="tx-title">Order #${orderId}</div>
              <div class="tx-time">Just now • 2 items</div>
            </div>
          </div>
          <div>
            <div class="tx-amount">₹${saleAmount}</div>
            <span class="tx-status-pill">● Paid</span>
          </div>
        `;
        posTxList.insertBefore(newTx, posTxList.firstChild);
        if (posTxList.children.length > 4) {
          posTxList.removeChild(posTxList.lastChild);
        }
      }

      showToast(`⚡ Live POS: Order #${orderId} rang up for ₹${saleAmount} via UPI! Register synced.`, 'success', 4000);
    });
  }

  if (heroSimulateScanBtn) {
    heroSimulateScanBtn.addEventListener('click', () => {
      const skus = ['SKU-8921 (Arabica Beans 1kg)', 'SKU-4412 (Organic Almond Milk)', 'SKU-7703 (USB-C Fast Cable)'];
      const randomSku = skus[Math.floor(Math.random() * skus.length)];
      showToast(`📷 Barcode Scanned: [8901030${Math.floor(10000 + Math.random()*90000)}] → Added ${randomSku} to current basket.`, 'info', 4000);
    });
  }

  /* =========================================================================
     3. Product Showcase Interactive Tabs & Visuals
     ========================================================================= */
  const showcaseTabs = document.querySelectorAll('.showcase-tab-btn');
  const showcaseContent = document.getElementById('showcaseContent');

  const showcaseData = {
    overview: `
      <div class="dashboard-grid-showcase">
        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Weekly Sales & Peak Traffic Analysis</span>
            <span style="font-size:0.75rem;color:var(--accent);">Live Telemetry</span>
          </div>
          <div class="bar-chart-bars">
            <div class="bar-col">
              <div class="bar-fill" style="height: 65%;">
                <span class="bar-val-tooltip">₹38.2K</span>
              </div>
              <span class="bar-label">Mon</span>
            </div>
            <div class="bar-col">
              <div class="bar-fill" style="height: 78%;">
                <span class="bar-val-tooltip">₹45.9K</span>
              </div>
              <span class="bar-label">Tue</span>
            </div>
            <div class="bar-col">
              <div class="bar-fill" style="height: 52%;">
                <span class="bar-val-tooltip">₹31.4K</span>
              </div>
              <span class="bar-label">Wed</span>
            </div>
            <div class="bar-col">
              <div class="bar-fill" style="height: 88%;">
                <span class="bar-val-tooltip">₹51.8K</span>
              </div>
              <span class="bar-label">Thu</span>
            </div>
            <div class="bar-col">
              <div class="bar-fill" style="height: 94%;">
                <span class="bar-val-tooltip">₹58.6K</span>
              </div>
              <span class="bar-label">Fri</span>
            </div>
            <div class="bar-col">
              <div class="bar-fill" style="height: 100%;">
                <span class="bar-val-tooltip">₹68.4K</span>
              </div>
              <span class="bar-label">Sat</span>
            </div>
            <div class="bar-col">
              <div class="bar-fill" style="height: 82%;">
                <span class="bar-val-tooltip">₹49.1K</span>
              </div>
              <span class="bar-label">Sun</span>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:16px;font-size:0.8125rem;color:var(--text-secondary);">
            <div>Total Week Revenue: <strong style="color:var(--white);">₹3,43,450</strong></div>
            <div style="color:var(--success);">↑ +14.6% vs previous week</div>
          </div>
        </div>

        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Store Leaderboard</span>
            <span style="font-size:0.75rem;color:var(--muted);">3 Branches</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm);border:1px solid var(--border);">
              <div style="display:flex;justify-content:space-between;font-size:0.875rem;font-weight:600;color:var(--white);">
                <span>Downtown Flagship</span>
                <span style="color:var(--accent);">₹1,85,200</span>
              </div>
              <div style="font-size:0.75rem;color:var(--muted);margin-top:2px;">54% of consolidated sales • 98 orders/day</div>
            </div>
            <div style="padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm);border:1px solid var(--border);">
              <div style="display:flex;justify-content:space-between;font-size:0.875rem;font-weight:600;color:var(--white);">
                <span>Westside Mall Outlet</span>
                <span style="color:var(--primary-light);">₹1,12,450</span>
              </div>
              <div style="font-size:0.75rem;color:var(--muted);margin-top:2px;">33% of consolidated sales • 62 orders/day</div>
            </div>
            <div style="padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm);border:1px solid var(--border);">
              <div style="display:flex;justify-content:space-between;font-size:0.875rem;font-weight:600;color:var(--white);">
                <span>Airport Express Hub</span>
                <span style="color:var(--white);">₹45,800</span>
              </div>
              <div style="font-size:0.75rem;color:var(--muted);margin-top:2px;">13% of consolidated sales • 38 orders/day</div>
            </div>
          </div>
        </div>
      </div>
    `,

    sales: `
      <div class="dashboard-grid-showcase">
        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Recent High-Volume Invoices</span>
            <span class="status-badge in-stock">GST Verified</span>
          </div>
          <table class="mini-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Items</th>
                <th>Tender</th>
                <th>Tax (GST)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.75rem;">INV-2026-4491</td>
                <td>Premium Headphones + Case</td>
                <td>UPI (GPay)</td>
                <td>₹1,440 (18%)</td>
                <td style="font-weight:700;color:var(--accent);">₹9,440</td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.75rem;">INV-2026-4490</td>
                <td>Smart Watch Pro × 2</td>
                <td>Credit Card</td>
                <td>₹2,160 (18%)</td>
                <td style="font-weight:700;color:var(--accent);">₹14,160</td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.75rem;">INV-2026-4489</td>
                <td>Oat Milk Box (12pk)</td>
                <td>Cash</td>
                <td>₹96 (5%)</td>
                <td style="font-weight:700;color:var(--accent);">₹2,016</td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.75rem;">INV-2026-4488</td>
                <td>Linen Casual Shirt - Navy</td>
                <td>Split (UPI + Cash)</td>
                <td>₹260 (12%)</td>
                <td style="font-weight:700;color:var(--accent);">₹2,450</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Payment Tender Split</span>
            <span style="font-size:0.75rem;color:var(--muted);">Today</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px;margin-top:10px;">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:6px;">
                <span>Unified Payments (UPI / QR)</span>
                <strong style="color:var(--primary-light);">56% (₹24,000)</strong>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="width:56%;height:100%;background:var(--primary);"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:6px;">
                <span>Credit & Debit Cards (POS)</span>
                <strong style="color:var(--accent);">32% (₹13,712)</strong>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="width:32%;height:100%;background:var(--accent);"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:6px;">
                <span>Cash Registers</span>
                <strong style="color:var(--success);">12% (₹5,138)</strong>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="width:12%;height:100%;background:var(--success);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    inventory: `
      <div class="dashboard-grid-showcase">
        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Critical Stock & Reorder Levels</span>
            <span class="status-badge low-stock">Automated PO Ready</span>
          </div>
          <table class="mini-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Current</th>
                <th>Reorder Buffer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.75rem;">SKU-8921</td>
                <td>Arabica Roast Beans 1kg</td>
                <td style="color:var(--warning);font-weight:700;">4 pk</td>
                <td>15 pk</td>
                <td><span class="status-badge low-stock">Low Stock</span></td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.75rem;">SKU-4412</td>
                <td>Organic Almond Milk 1L</td>
                <td style="color:var(--danger);font-weight:700;">2 pk</td>
                <td>20 pk</td>
                <td><span class="status-badge critical">Critical</span></td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.75rem;">SKU-7703</td>
                <td>Type-C Braided Cable 2m</td>
                <td style="color:var(--warning);font-weight:700;">6 units</td>
                <td>25 units</td>
                <td><span class="status-badge low-stock">Low Stock</span></td>
              </tr>
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.75rem;">SKU-1092</td>
                <td>Thermal Paper Rolls 80mm</td>
                <td style="color:var(--success);font-weight:700;">48 rolls</td>
                <td>30 rolls</td>
                <td><span class="status-badge in-stock">Healthy</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Inventory Valuation</span>
            <span style="font-size:0.75rem;color:var(--accent);">Real-Time FIFO</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;margin-top:6px;">
            <div style="font-size:1.75rem;font-weight:800;color:var(--white);font-family:var(--font-display);">
              ₹14,20,500
            </div>
            <div style="font-size:0.8125rem;color:var(--text-secondary);">
              Total 1,480 catalog SKUs across 3 stores and 1 central distribution warehouse.
            </div>
            <div style="margin-top:8px;padding:12px;background:rgba(45,212,191,0.06);border:1px solid rgba(45,212,191,0.2);border-radius:var(--radius-sm);font-size:0.8125rem;color:var(--accent);">
              ✦ Low-stock batch auto-drafted into 2 Supplier Purchase Orders ready for approval.
            </div>
          </div>
        </div>
      </div>
    `,

    customers: `
      <div class="dashboard-grid-showcase">
        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Top Loyalty Champions</span>
            <span class="status-badge in-stock">Tier: Gold & VIP</span>
          </div>
          <table class="mini-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Visits</th>
                <th>Total Spend</th>
                <th>Loyalty Balance</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dr. Meera Iyer</strong></td>
                <td>28 visits</td>
                <td>₹64,200</td>
                <td style="color:var(--accent);">1,280 pts</td>
                <td><span class="status-badge in-stock">VIP Tier</span></td>
              </tr>
              <tr>
                <td><strong>Arjun Varma</strong></td>
                <td>19 visits</td>
                <td>₹42,850</td>
                <td style="color:var(--accent);">850 pts</td>
                <td><span class="status-badge in-stock">Gold</span></td>
              </tr>
              <tr>
                <td><strong>Sneha Roy</strong></td>
                <td>14 visits</td>
                <td>₹29,100</td>
                <td style="color:var(--accent);">580 pts</td>
                <td><span class="status-badge in-stock">Gold</span></td>
              </tr>
              <tr>
                <td><strong>Karan Joshi</strong></td>
                <td>9 visits</td>
                <td>₹18,400</td>
                <td style="color:var(--accent);">360 pts</td>
                <td><span class="status-badge in-stock">Silver</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Customer Health & Retention</span>
            <span style="font-size:0.75rem;color:var(--muted);">30-Day Cohort</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:6px;">
                <span>Repeat Customer Rate</span>
                <strong style="color:var(--accent);">68.4%</strong>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="width:68.4%;height:100%;background:var(--accent);"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:6px;">
                <span>Average Lifetime Value (LTV)</span>
                <strong style="color:var(--white);">₹8,450</strong>
              </div>
              <div style="font-size:0.75rem;color:var(--muted);">+22% increase with AFTERSHOP loyalty program</div>
            </div>

            <div style="padding:10px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border);font-size:0.8125rem;color:var(--text-secondary);">
              342 new shoppers enrolled via phone number checkout in the past 7 days.
            </div>
          </div>
        </div>
      </div>
    `,

    analytics: `
      <div class="dashboard-grid-showcase">
        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Gross Margin & Profitability Trends</span>
            <span style="font-size:0.75rem;color:var(--success);">Target: > 28%</span>
          </div>
          <div style="height:190px;width:100%;position:relative;">
            <svg viewBox="0 0 500 180" style="width:100%;height:100%;overflow:visible;">
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2DD4BF" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#2DD4BF" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
              <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
              
              <path d="M 0 130 Q 80 140, 150 90 T 320 60 T 500 35 L 500 170 L 0 170 Z" fill="url(#profitGrad)"/>
              <path d="M 0 130 Q 80 140, 150 90 T 320 60 T 500 35" fill="none" stroke="#2DD4BF" stroke-width="3"/>
              
              <circle cx="320" cy="60" r="5" fill="#2DD4BF" stroke="#FFFFFF" stroke-width="2"/>
              <circle cx="500" cy="35" r="5" fill="#6366F1" stroke="#FFFFFF" stroke-width="2"/>
            </svg>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.8125rem;color:var(--text-secondary);margin-top:10px;">
            <span>Current Net Margin: <strong style="color:var(--white);">31.2%</strong></span>
            <span>COGS Optimization: <strong style="color:var(--accent);">+3.8%</strong></span>
          </div>
        </div>

        <div class="sub-panel">
          <div class="sub-panel-title">
            <span>Staff Sales Leaderboard</span>
            <span style="font-size:0.75rem;color:var(--muted);">Current Shift</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border);">
              <div>
                <div style="font-size:0.875rem;font-weight:600;color:var(--white);">Pooja S. (Register 1)</div>
                <div style="font-size:0.6875rem;color:var(--muted);">42 transactions • Avg 45s</div>
              </div>
              <div style="font-weight:700;color:var(--accent);font-size:0.9375rem;">₹18,920</div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border);">
              <div>
                <div style="font-size:0.875rem;font-weight:600;color:var(--white);">Deepak M. (Register 2)</div>
                <div style="font-size:0.6875rem;color:var(--muted);">36 transactions • Avg 52s</div>
              </div>
              <div style="font-weight:700;color:var(--primary-light);font-size:0.9375rem;">₹14,640</div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--border);">
              <div>
                <div style="font-size:0.875rem;font-weight:600;color:var(--white);">Rohan K. (Mobile Register)</div>
                <div style="font-size:0.6875rem;color:var(--muted);">21 transactions • Avg 38s</div>
              </div>
              <div style="font-weight:700;color:var(--white);font-size:0.9375rem;">₹9,290</div>
            </div>
          </div>
        </div>
      </div>
    `
  };

  function setTab(tabKey) {
    if (!showcaseContent || !showcaseData[tabKey]) return;

    showcaseTabs.forEach(btn => {
      const isSelected = btn.getAttribute('data-tab') === tabKey;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    showcaseContent.classList.add('switching');
    setTimeout(() => {
      showcaseContent.innerHTML = showcaseData[tabKey];
      showcaseContent.classList.remove('switching');
    }, 150);
  }

  showcaseTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) setTab(tab);
    });
  });

  // Initial tab render
  setTab('overview');

  /* =========================================================================
     4. AI Assistant Engine (In-Page & Floating Widget)
     ========================================================================= */
  const aiKnowledgeBase = {
    "which products generated the most revenue this week?": `Your top 3 revenue-generating products this week are:<br><br>
      1. <strong>Premium Wireless Headphones</strong> — ₹84,500 (34 units sold)<br>
      2. <strong>Smart Watch Pro</strong> — ₹71,200 (18 units sold)<br>
      3. <strong>Bluetooth Speaker X</strong> — ₹56,850 (22 units sold)<br><br>
      <em>Recommendation: Stock levels for Headphones are below 8 units. Consider triggering a reorder PO today.</em>`,

    "why did sales drop yesterday?": `Yesterday's consolidated sales dipped by <strong>11.4%</strong> compared to the 30-day Tuesday average. Here is the operational breakdown:<br><br>
      • <strong>Rainfall & Reduced Footfall:</strong> Mall branch visits were down 24% between 15:00 and 19:00.<br>
      • <strong>Stockout Impact:</strong> 2 high-velocity SKUs (Organic Oat Milk and Arabica Beans) were out of stock, causing an estimated ₹6,400 in lost basket value.<br>
      • <strong>Digital UPI Invoicing:</strong> Online orders compensated by +8% in the evening.`,

    "what should i reorder?": `Based on your average sales velocity and supplier lead times, here are 3 immediate recommended reorders:<br><br>
      1. <strong>Organic Almond Milk 1L</strong>: 2 units left (Runout in ~6 hours). Reorder 24 units from Heritage Foods.<br>
      2. <strong>Arabica Roast Beans 1kg</strong>: 4 units left. Reorder 20 units.<br>
      3. <strong>Thermal Receipt Rolls 80mm</strong>: 6 rolls left in Register 2. Reorder 1 carton.`,

    "show my best-selling products.": `Your all-time volume bestsellers are:<br><br>
      1. <strong>Organic Oat Milk 1L</strong> — 412 units/mo (₹1,03,000)<br>
      2. <strong>Cold Brew Coffee Concentrate</strong> — 380 units/mo (₹76,000)<br>
      3. <strong>Artisan Sourdough Loaf</strong> — 290 units/mo (₹43,500)<br>
      4. <strong>Linen Shirt Classic Navy</strong> — 145 units/mo (₹2,17,500)`,

    "compare this month with last month.": `Month-over-Month Performance Comparison (Current vs Previous):<br><br>
      • <strong>Gross Revenue:</strong> ₹12,84,500 vs ₹11,20,000 (<strong>↑ +14.7%</strong>)<br>
      • <strong>Total Invoices:</strong> 3,420 vs 3,110 (<strong>↑ +10.0%</strong>)<br>
      • <strong>Average Basket Size:</strong> ₹375.50 vs ₹360.10 (<strong>↑ +4.3%</strong>)<br>
      • <strong>Gross Margin:</strong> 31.4% vs 29.8% (<strong>↑ +1.6%</strong>)<br><br>
      <em>Store #01 Downtown continues to lead with 54% total contribution.</em>`,

    "pricing": `AFTERSHOP offers 3 transparent plans:<br><br>
      • <strong>Starter:</strong> ₹999/mo (₹9,590/yr) — 1 store, 2 users, core POS & inventory.<br>
      • <strong>Growth (Most Popular):</strong> ₹1,999/mo (₹19,190/yr) — 3 stores, 10 users, AI assistant, advanced analytics & loyalty.<br>
      • <strong>Enterprise:</strong> ₹4,999/mo (₹47,990/yr) — Unlimited stores, custom RBAC & API pipelines.<br><br>
      Annual billing saves 20%! Would you like to start a 14-day free trial?`,

    "features": `AFTERSHOP provides 6 integrated pillars:<br><br>
      1. <strong>POS & Fast Billing:</strong> Barcode scanning, GST invoices, split payments, offline resilience.<br>
      2. <strong>Inventory Management:</strong> Real-time SKU tracking, low stock alerts, supplier purchase orders.<br>
      3. <strong>Customer Loyalty:</strong> Profiles, points, WhatsApp bills, customer cohorts.<br>
      4. <strong>Analytics & Margins:</strong> Profit reports, staff leaderboard, footfall peaks.<br>
      5. <strong>Multi-Store Sync:</strong> Central catalog and stock transfers.<br>
      6. <strong>AI Assistant:</strong> Real-time plain-English retail queries.`,

    "book demo": `You can schedule a 1-on-1 personalized demo anytime! Simply click the "Book a Demo" button in the hero section or top navigation to pick your preferred date and time.`,

    "contact sales": `You can reach our sales team directly at <strong>sales@aftershop.com</strong> or call us at <strong>+91 00000 00000</strong>. Our retail software architects are based in Kerala, India and assist stores worldwide!`
  };

  function getAiResponse(userText) {
    const cleanText = userText.toLowerCase().trim();

    // Exact matches
    if (aiKnowledgeBase[cleanText]) {
      return aiKnowledgeBase[cleanText];
    }

    // Partial/Keyword matches
    if (cleanText.includes('product') || cleanText.includes('revenue') || cleanText.includes('best seller') || cleanText.includes('selling')) {
      return aiKnowledgeBase["which products generated the most revenue this week?"];
    }
    if (cleanText.includes('reorder') || cleanText.includes('stock') || cleanText.includes('inventory')) {
      return aiKnowledgeBase["what should i reorder?"];
    }
    if (cleanText.includes('drop') || cleanText.includes('yesterday') || cleanText.includes('sales fell')) {
      return aiKnowledgeBase["why did sales drop yesterday?"];
    }
    if (cleanText.includes('month') || cleanText.includes('compare') || cleanText.includes('growth')) {
      return aiKnowledgeBase["compare this month with last month."];
    }
    if (cleanText.includes('price') || cleanText.includes('cost') || cleanText.includes('plan')) {
      return aiKnowledgeBase["pricing"];
    }
    if (cleanText.includes('feature') || cleanText.includes('pos') || cleanText.includes('manage')) {
      return aiKnowledgeBase["features"];
    }
    if (cleanText.includes('demo') || cleanText.includes('trial')) {
      return aiKnowledgeBase["book demo"];
    }
    if (cleanText.includes('contact') || cleanText.includes('support') || cleanText.includes('help') || cleanText.includes('call')) {
      return aiKnowledgeBase["contact sales"];
    }

    // Fallback general retail intelligence
    return `Based on your live retail data across all connected stores:<br><br>
      • Active registers are synced with zero latency.<br>
      • Consolidated gross revenue is tracking <strong>+18.4%</strong> higher today.<br>
      • Gross margins are steady at 31.2%.<br><br>
      Would you like me to inspect <strong>Today's Top Products</strong>, <strong>Reorder Alerts</strong>, or <strong>Store Comparison</strong>?`;
  }

  // Handle In-Page AI Assistant
  const inpageChatBody = document.getElementById('inpageChatBody');
  const inpageChatForm = document.getElementById('inpageChatForm');
  const inpageChatInput = document.getElementById('inpageChatInput');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const promptButtons = document.querySelectorAll('.prompt-btn');

  function appendChatBubble(container, text, isUser = false) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'user' : 'ai'}`;
    bubble.innerHTML = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    return bubble;
  }

  function simulateAiResponse(container, userQuery) {
    appendChatBubble(container, userQuery, true);

    // Typing dots
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      indicator.remove();
      const reply = getAiResponse(userQuery);
      appendChatBubble(container, reply, false);
    }, 750);
  }

  if (inpageChatForm && inpageChatInput && inpageChatBody) {
    inpageChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = inpageChatInput.value.trim();
      if (!query) return;
      inpageChatInput.value = '';
      simulateAiResponse(inpageChatBody, query);
    });

    promptButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query) {
          simulateAiResponse(inpageChatBody, query);
        }
      });
    });

    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => {
        inpageChatBody.innerHTML = `
          <div class="chat-bubble ai">
            Conversation reset. Ask any questions about your store's sales, stock levels, or operational metrics!
          </div>
        `;
      });
    }
  }

  // Floating AI Chat Widget
  const floatingAiLauncher = document.getElementById('floatingAiLauncher');
  const floatingAiWindow = document.getElementById('floatingAiWindow');
  const closeAiWidgetBtn = document.getElementById('closeAiWidgetBtn');
  const widgetMessagesArea = document.getElementById('widgetMessagesArea');
  const widgetChatForm = document.getElementById('widgetChatForm');
  const widgetChatInput = document.getElementById('widgetChatInput');
  const quickChips = document.querySelectorAll('.quick-chip');

  if (floatingAiLauncher && floatingAiWindow) {
    floatingAiLauncher.addEventListener('click', () => {
      const isOpen = floatingAiWindow.classList.toggle('open');
      if (isOpen && widgetChatInput) {
        widgetChatInput.focus();
      }
    });

    if (closeAiWidgetBtn) {
      closeAiWidgetBtn.addEventListener('click', () => {
        floatingAiWindow.classList.remove('open');
      });
    }

    if (widgetChatForm && widgetChatInput && widgetMessagesArea) {
      widgetChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = widgetChatInput.value.trim();
        if (!query) return;
        widgetChatInput.value = '';
        simulateAiResponse(widgetMessagesArea, query);
      });
    }

    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-quick');
        if (query && widgetMessagesArea) {
          simulateAiResponse(widgetMessagesArea, query);
        }
      });
    });
  }

  /* =========================================================================
     5. Interactive Industry Verticals Selector
     ========================================================================= */
  const industryPills = document.querySelectorAll('.industry-btn');
  const industryPanel = document.getElementById('industryPanel');

  const industryProfiles = {
    grocery: {
      title: "Grocery & Convenience Stores",
      desc: "High volume, fast checkout, weighing scale integration, and perishable stock controls tailored for busy supermarkets.",
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
      desc: "Manage matrix variants (Size, Color, Fit, Fabric) with seasonal collections and personalized trial-room styling histories.",
      features: [
        "Matrix matrix variant grid (S/M/L/XL × Colors)",
        "Seasonal discount rules & Buy-1-Get-1",
        "Garment tag & barcode printing",
        "Customer size profile & preferences"
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
      desc: "Track serial numbers, IMEIs, manufacturer warranty periods, and accessory bundles with high ticket fraud protection.",
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
      desc: "Strict batch number tracking, drug expiry alerts, doctor prescription attachments, and schedule drug compliance.",
      features: [
        "Batch number & expiry management",
        "Prescription image upload & filing",
        "Generic substitute recommendation",
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
    beauty: {
      title: "Beauty, Cosmetics & Salons",
      desc: "Shade match records, allergy warnings, membership packages, and therapist appointment commission tracking.",
      features: [
        "Shade & skin-type customer notes",
        "Membership package redemptions",
        "Staff service commission tracker",
        "WhatsApp appointment reminders"
      ],
      codeSnippet: `// Customer Profile & Beauty Notes
CustomerDB.updateAttributes("CUST-901", {
  skinTone: "Warm Honey",
  allergies: ["Fragrance-oil"],
  loyaltyTier: "Diamond Glam"
});`
    },
    furniture: {
      title: "Furniture & Home Decor Showrooms",
      desc: "Handle custom made-to-order requests, partial advance deposits, split delivery schedules, and room dimension notes.",
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
    restaurants: {
      title: "Quick-Serve Cafes & Casual Dining",
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
    supermarkets: {
      title: "Supermarkets & Hypermarkets",
      desc: "Multi-register lane synchronization, conveyor scale speed, cashier float audit, and lightning barcode throughput.",
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
          <div class="section-eyebrow indigo">${indKey.toUpperCase()} SPECIALIZATION</div>
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <ul class="ind-features-list">
            ${data.features.map(f => `<li><span style="color:var(--accent);font-weight:700;">✓</span> ${f}</li>`).join('')}
          </ul>
        </div>
        <div class="ind-preview-box">
          <div class="ind-preview-header">Engine Workflow Execution</div>
          <pre class="ind-preview-content"><code>${data.codeSnippet}</code></pre>
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

  // Initial industry render
  updateIndustryPanel('grocery');

  /* =========================================================================
     6. Dynamic Pricing Toggle (Monthly vs Annual)
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
     7. Modals Architecture (Checkout, Demo, Enquiry)
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
    // If no other modals open, restore overflow
    const hasOpen = allModals.some(m => m?.classList.contains('open'));
    if (!hasOpen) {
      document.body.style.overflow = '';
    }
  }

  // Close modals on overlay backdrop click or close button
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

  // ESC key closes modals & floating windows
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(m => closeModal(m));
      floatingAiWindow?.classList.remove('open');
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

  // Checkout Form Submission (Frontend Simulation)
  const checkoutForm = document.getElementById('checkoutForm');
  checkoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const bName = document.getElementById('checkoutBusiness')?.value || 'Your Store';
    
    // In production: Connect Razorpay/Stripe checkout API
    showToast(`Payment integration will be connected here. Demo subscription registered for "${bName}".`, 'success', 6000);
    closeModal(checkoutModal);
    checkoutForm.reset();
  });

  // Demo Booking Modal Triggers & Submission
  const openDemoButtons = document.querySelectorAll('.open-demo-btn');
  openDemoButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(demoModal));
  });

  const demoBookingForm = document.getElementById('demoBookingForm');
  demoBookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const demoDate = document.getElementById('demoDate')?.value;
    const demoTime = document.getElementById('demoTime')?.value;

    showToast(`Demo request received! Our solution architect will meet you on ${demoDate || 'scheduled date'} at ${demoTime}.`, 'success', 6000);
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

  // Floating Enquiry Button & Submission
  const floatingEnquiryBtn = document.getElementById('floatingEnquiryBtn');
  floatingEnquiryBtn?.addEventListener('click', () => openModal(enquiryModal));

  const quickEnquiryForm = document.getElementById('quickEnquiryForm');
  quickEnquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const enquiryId = `ENQ-20260922-${randomDigits}`;

    // Store in demo localStorage
    const savedEnquiries = JSON.parse(localStorage.getItem('aftershop_enquiries') || '[]');
    savedEnquiries.push({
      id: enquiryId,
      name: document.getElementById('enqName')?.value,
      business: document.getElementById('enqBusiness')?.value,
      created: new Date().toISOString()
    });
    localStorage.setItem('aftershop_enquiries', JSON.stringify(savedEnquiries));

    showToast(`Enquiry submitted successfully! Reference ID: ${enquiryId}. Our team will contact you shortly.`, 'success', 6500);
    closeModal(enquiryModal);
    quickEnquiryForm.reset();
  });

  /* =========================================================================
     8. Support Ticket System (Submission & Real-time Tracking)
     ========================================================================= */
  const ticketSubmitForm = document.getElementById('ticketSubmitForm');
  const ticketTrackForm = document.getElementById('ticketTrackForm');
  const trackTicketIdInput = document.getElementById('trackTicketId');
  const trackResultBox = document.getElementById('trackResultBox');

  // Pre-seed mock demo ticket
  const seedTickets = {
    'AS-10482': {
      id: 'AS-10482',
      name: 'Retail Partner',
      subject: 'Thermal Printer Driver Setup (Epson TM-T82III)',
      category: 'POS & Hardware',
      priority: 'Medium',
      status: 'In Progress',
      note: 'Our hardware support team is reviewing the ESC/POS driver compatibility for Register #2.'
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
      note: 'Ticket received and queued for technical review by our retail operations desk.'
    };

    saveStoredTicket(newTicket);

    showToast(`Ticket #${dynamicId} created successfully. Keep this ID for tracking.`, 'success', 6500);

    // Auto-populate into tracker for immediate test convenience
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
          <strong style="color:var(--white);font-size:1rem;">Ticket #${found.id}</strong>
          <span class="status-badge ${found.status === 'Resolved' ? 'in-stock' : 'low-stock'}">● ${found.status}</span>
        </div>
        <div style="font-size:0.8125rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:6px;">
          <div><strong>Subject:</strong> ${found.subject}</div>
          <div><strong>Category:</strong> ${found.category} | <strong>Priority:</strong> <span style="color:var(--accent);">${found.priority}</span></div>
          <div style="margin-top:8px;padding:10px;background:rgba(255,255,255,0.03);border-radius:var(--radius-sm);border:1px solid var(--border);color:var(--white);">
            <strong>Desk Note:</strong> ${found.note}
          </div>
        </div>
      `;
      showToast(`Found status for Ticket #${found.id}`, 'info');
    } else {
      trackResultBox.innerHTML = `
        <div style="color:var(--warning);font-weight:600;font-size:0.875rem;margin-bottom:6px;">
          Ticket #${id} Not Found
        </div>
        <p style="font-size:0.8125rem;color:var(--text-secondary);">
          Please verify your reference number. You can test with <strong>AS-10482</strong> or submit a new ticket above.
        </p>
      `;
    }
  });

  /* =========================================================================
     9. Contact Enquiry Form
     ========================================================================= */
  const contactEnquiryForm = document.getElementById('contactEnquiryForm');
  contactEnquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thanks! Your enquiry has been received. Our team will get back to you shortly.', 'success', 6000);
    contactEnquiryForm.reset();
  });

  /* =========================================================================
     10. FAQ Accordion
     ========================================================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items for clean accordion behavior
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

  // Open first FAQ item by default
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
     11. Console Branding Message
     ========================================================================= */
  console.log(
    '%c AFTERSHOP %c Beyond Every Sale. %c',
    'background:#6366F1;color:#FFFFFF;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;',
    'background:#0F172A;color:#2DD4BF;font-weight:bold;padding:4px 8px;border-radius:0 4px 4px 0;',
    'color:inherit;'
  );

})();
