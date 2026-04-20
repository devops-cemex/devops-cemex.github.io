/* CEMEX — quote.html prefill
 * Reads query params:
 *   ?service=<generators|solar|vehicles|power|construction|facility|marine|catering|consultation>
 *   ?product=<york-150-kva|mikano-150-kva>
 *   ?bundle=<solar-2.5kva|solar-3kva|solar-5kva|solar-10kva>
 *   ?vehicle=<changan-*|gwm-*|zna-*|star5-*|g10-bus>
 * Side effects:
 *   - Selects the matching #project-type option
 *   - Writes a human-readable label into #product-ref-label + the hidden product_ref field
 *   - Shows the "Enquiring about:" banner above the form grid
 *   - Seeds the description textarea with a prefilled first line (only if empty)
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

    var BUNDLES = {
        "solar-2.5kva":     { label: "Solar Bundle — 2.5 KVA (Starter)",        category: "solar" },
        "solar-3kva":       { label: "Solar Bundle — 3 KVA (Home Essentials)",  category: "solar" },
        "solar-5kva":       { label: "Solar Bundle — 5 KVA (Family Home)",      category: "solar" },
        "solar-10kva":      { label: "Solar Bundle — 10 KVA (SME / Large Home)", category: "solar" },
        "solar-estate-standard": { label: "Estate Solar Package — Standard", category: "solar" },
        "solar-estate-premium":  { label: "Estate Solar Package — Premium",  category: "solar" }
    };

    var VEHICLES = {
        "changan-alsvin":    { label: "Changan Alsvin",    category: "vehicles" },
        "changan-eado-plus": { label: "Changan Eado Plus", category: "vehicles" },
        "changan-uni-v":     { label: "Changan Uni-V",     category: "vehicles" },
        "changan-cs35-plus": { label: "Changan CS35 Plus", category: "vehicles" },
        "changan-cs55-plus": { label: "Changan CS55 Plus", category: "vehicles" },
        "changan-x7-plus":   { label: "Changan X7 Plus",   category: "vehicles" },
        "changan-uni-k":     { label: "Changan Uni K",     category: "vehicles" },
        "gwm-tank-300":      { label: "GWM Tank 300",      category: "vehicles" },
        "gwm-tank-500":      { label: "GWM Tank 500",      category: "vehicles" },
        "zna-rich-6":        { label: "ZNA Rich 6",        category: "vehicles" },
        "g10-bus":           { label: "Changan G10 Bus",   category: "vehicles" },
        "star5-cargo":       { label: "Changan Star 5 Cargo", category: "vehicles" },
        "star5-truck":       { label: "Changan Star 5 Truck", category: "vehicles" }
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

    function prefillDescription(textarea, label) {
        if (!textarea || !label) return;
        var current = (textarea.value || "").trim();
        if (current.length > 0) return; // don't clobber anything the user or server-rendered
        textarea.value = "I'm interested in a quote for: " + label + ".\n\n";
    }

    // --- Init -----------------------------------------------------------
    function init() {
        var params = getParams();
        var match = resolve(params);
        if (!match) return;

        var typeSelect = document.getElementById("project-type");
        var refInput   = document.getElementById("product-ref");
        var banner     = document.getElementById("product-ref-banner");
        var bannerLbl  = document.getElementById("product-ref-label");
        var desc       = document.getElementById("description");

        if (match.category) {
            selectOption(typeSelect, match.category);
        }
        if (match.ref && refInput) {
            refInput.value = match.ref;
        }
        if (match.label) {
            if (bannerLbl) bannerLbl.textContent = match.label;
            if (banner) banner.hidden = false;
            prefillDescription(desc, match.label);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
