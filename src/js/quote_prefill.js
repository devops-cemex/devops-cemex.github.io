/* CEMEX — quote.html prefill
 * Reads query params:
 *   ?service=<generators|solar|vehicles|power|construction|facility|marine|catering|consultation>
 *   ?product=<york-150-kva|mikano-150-kva>
 *   ?bundle=<solar-small-home|solar-hybrid|solar-premium>
 *   ?vehicle=<maxus-*|zna-*|changan-*|deepal-*>
 *   ?finance=<sunfi|rivy>          (optional, currently used by solar_panels.html)
 * Side effects:
 *   - Selects the matching #project-type option
 *   - Writes a human-readable label into #product-ref-label + the hidden product_ref field
 *   - Shows the "Enquiring about:" banner above the form grid
 *   - Seeds the description textarea with a prefilled first line (only if empty)
 *   - Appends the chosen finance partner to the description when ?finance= is present
 */
(function () {
    "use strict";

    // --- Lookups --------------------------------------------------------
    // Map specific product/bundle/vehicle slugs -> { label, category }.
    // `category` must match one of the <option value="..."> strings on #project-type.
    var PRODUCTS = {
        "york-150-kva":     { label: "York 150 KVA Silent Generator",   category: "generators" },
        "mikano-150-kva":   { label: "Mikano 150 KVA Silent Generator", category: "generators" }
    };

    // Solar systems — kept in sync with /html/services/solar_panels.html
    var BUNDLES = {
        "solar-small-home": { label: "Solar System — Small Home (3.3 kW / 5 kWh)",     category: "solar" },
        "solar-hybrid":     { label: "Solar System — Hybrid (6 kW / 10.6 kWh)",        category: "solar" },
        "solar-premium":    { label: "Solar System — Premium (10 kVA / 16 kWh)",       category: "solar" }
    };

    // Vehicles — kept in sync with /html/services/vehicles.html (Mikano Motors lineup)
    var VEHICLES = {
        // Maxus
        "maxus-d90max-executive":          { label: "Maxus D90 MAX Executive (4WD)",          category: "vehicles" },
        "maxus-d90max-executive-pro":      { label: "Maxus D90 MAX Executive Pro (4WD)",      category: "vehicles" },
        "maxus-t60-comfort":               { label: "Maxus T60 Comfort (2WD, manual)",        category: "vehicles" },
        "maxus-t60-comfort-4x4":           { label: "Maxus T60 Comfort 4×4 (manual)",         category: "vehicles" },
        "maxus-t60-luxury":                { label: "Maxus T60 Luxury (2.0T 4×4 automatic)",  category: "vehicles" },
        "maxus-t90-luxury":                { label: "Maxus T90 Luxury (2.0T 4×4 automatic)",  category: "vehicles" },

        // ZNA
        "zna-luxury-double-cab":           { label: "ZNA Luxury Double Cab (2.4L 4×4)",       category: "vehicles" },

        // Changan — commercial
        "changan-star-truck-single-cab":   { label: "Changan Star Truck — Single Cab",        category: "vehicles" },
        "changan-star5-cargo":             { label: "Changan Star 5 Cargo Van",               category: "vehicles" },
        "changan-star5-passenger":         { label: "Changan Star 5 Passenger (8-seat)",      category: "vehicles" },
        "changan-g10-passenger":           { label: "Changan G10 Passenger (11-seat)",        category: "vehicles" },

        // Changan — pickup
        "changan-hunter-plus-luxury-pro":  { label: "Changan Hunter Plus Luxury Pro (2.0T 4×4)", category: "vehicles" },

        // Changan — sedans
        "changan-eado-elite":              { label: "Changan Eado Elite",                     category: "vehicles" },
        "changan-eado-plus-luxury":        { label: "Changan Eado Plus Luxury",               category: "vehicles" },

        // Changan — SUVs
        "changan-cs15-dynamic":            { label: "Changan CS15 Dynamic",                   category: "vehicles" },
        "changan-cs35-plus-luxury":        { label: "Changan CS35 Plus Luxury",               category: "vehicles" },
        "changan-cs55-pro":                { label: "Changan CS55 Pro",                       category: "vehicles" },
        "changan-cs55-plus-luxury":        { label: "Changan CS55 Plus Luxury",               category: "vehicles" },
        "changan-cs55-plus-luxury-pro":    { label: "Changan CS55 Plus Luxury Pro",           category: "vehicles" },
        "changan-x7-plus-luxury-pro":      { label: "Changan X7 Plus Luxury Pro (7-seat)",    category: "vehicles" },
        "changan-cs95-plus":                { label: "Changan CS95 Plus (7-seat, 4WD)",       category: "vehicles" },
        "changan-uni-s-luxury-pro":        { label: "Changan UNI-S Luxury Pro (Presale)",     category: "vehicles" },
        "changan-uni-t-svp":               { label: "Changan UNI-T SVP",                      category: "vehicles" },
        "changan-uni-k-bespoke":           { label: "Changan UNI-K Bespoke (AWD flagship)",   category: "vehicles" },

        // Deepal — REEV
        "deepal-g318-reev":                { label: "Deepal G318 REEV (424 HP, 1,100 km AWD)", category: "vehicles" },
        "deepal-s07-reev":                 { label: "Deepal S07 REEV (258 HP, 1,000 km RWD)",  category: "vehicles" },
        "deepal-s05-reev":                 { label: "Deepal S05 REEV (238 HP, 900 km RWD)",    category: "vehicles" }
    };

    // Optional finance-partner labels for ?finance= (used by solar_panels.html).
    var FINANCE_PARTNERS = {
        "sunfi": "Sunfi (30% deposit, 3 – 9 months, 2.5 – 3% monthly)",
        "rivy":  "Rivy (20% deposit, 3 – 18 months, 4% monthly)"
    };

    // `?service=` alias table — lets short/legacy slugs map onto the select values.
    var SERVICE_ALIASES = {
        "generators":          "generators",
        "generator":           "generators",
        "solar":               "solar",
        "solar-panels":        "solar",
        "solar_panels":        "solar",
        "vehicles":            "vehicles",
        "vehicle":             "vehicles",
        "power":               "power",
        "power-solutions":     "power",
        "construction":        "construction",
        "construction-services": "construction",
        "facility":            "facility_management",
        "facility-management": "facility_management",
        "facility_management": "facility_management",
        "marine":              "marine",
        "marine-welfare":      "marine",
        "catering":            "catering",
        "consultation":        "consultation"
    };

    // --- Helpers --------------------------------------------------------
    function getParams() {
        try {
            return new URLSearchParams(window.location.search);
        } catch (e) {
            return null;
        }
    }

    function resolve(params) {
        if (!params) return null;
        // Priority: most specific wins — vehicle > bundle > product > service.
        var v = (params.get("vehicle") || "").trim().toLowerCase();
        if (v && VEHICLES[v]) return { ref: v, label: VEHICLES[v].label, category: VEHICLES[v].category };

        var b = (params.get("bundle") || "").trim().toLowerCase();
        if (b && BUNDLES[b]) return { ref: b, label: BUNDLES[b].label, category: BUNDLES[b].category };

        var p = (params.get("product") || "").trim().toLowerCase();
        if (p && PRODUCTS[p]) return { ref: p, label: PRODUCTS[p].label, category: PRODUCTS[p].category };

        var s = (params.get("service") || "").trim().toLowerCase();
        if (s && SERVICE_ALIASES[s]) return { ref: "", label: "", category: SERVICE_ALIASES[s] };

        return null;
    }

    function resolveFinance(params) {
        if (!params) return null;
        var f = (params.get("finance") || "").trim().toLowerCase();
        return (f && FINANCE_PARTNERS[f]) ? FINANCE_PARTNERS[f] : null;
    }

    function selectOption(selectEl, value) {
        if (!selectEl || !value) return false;
        for (var i = 0; i < selectEl.options.length; i++) {
            if (selectEl.options[i].value === value) {
                selectEl.selectedIndex = i;
                // Fire a change event in case other code (validation, analytics) listens.
                selectEl.dispatchEvent(new Event("change", { bubbles: true }));
                return true;
            }
        }
        return false;
    }

    function prefillDescription(textarea, label, financeNote) {
        if (!textarea) return;
        var current = (textarea.value || "").trim();
        if (current.length > 0) return; // don't clobber anything the user or server-rendered
        var lines = [];
        if (label) {
            lines.push("I'm interested in a quote for: " + label + ".");
        }
        if (financeNote) {
            lines.push("Preferred financing partner: " + financeNote + ".");
        }
        if (lines.length === 0) return;
        textarea.value = lines.join("\n") + "\n\n";
    }

    // --- Init -----------------------------------------------------------
    function init() {
        var params  = getParams();
        var match   = resolve(params);
        var finance = resolveFinance(params);
        if (!match && !finance) return;

        var typeSelect = document.getElementById("project-type");
        var refInput   = document.getElementById("product-ref");
        var banner     = document.getElementById("product-ref-banner");
        var bannerLbl  = document.getElementById("product-ref-label");
        var desc       = document.getElementById("description");

        if (match && match.category) {
            selectOption(typeSelect, match.category);
        }
        if (match && match.ref && refInput) {
            refInput.value = match.ref;
        }
        if (match && match.label) {
            if (bannerLbl) bannerLbl.textContent = match.label;
            if (banner) banner.hidden = false;
        }
        // Always seed the description if there's something useful to say.
        prefillDescription(desc, match ? match.label : "", finance);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
