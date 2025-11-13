const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// City areas with coordinates
const areas = {
    'Central Hub': {x: 500, y: 350, parcelCount: 0},
    'North District': {x: 500, y: 200, parcelCount: 0},
    'South District': {x: 500, y: 500, parcelCount: 0},
    'East District': {x: 650, y: 350, parcelCount: 0},
    'West District': {x: 350, y: 350, parcelCount: 0},
    'Downtown': {x: 450, y: 300, parcelCount: 0},
    'Suburb North': {x: 550, y: 150, parcelCount: 0},
    'Suburb South': {x: 550, y: 550, parcelCount: 0},
    'Industrial Zone': {x: 300, y: 450, parcelCount: 0},
    'Tech Park': {x: 700, y: 300, parcelCount: 0},
    'Shopping District': {x: 400, y: 400, parcelCount: 0},
    'Residential East': {x: 650, y: 450, parcelCount: 0},
    'Residential West': {x: 350, y: 250, parcelCount: 0},
    'Business Park': {x: 600, y: 250, parcelCount: 0}
};

// Road network connections
const roadNetwork = [
    ['Central Hub', 'North District'], ['Central Hub', 'South District'],
    ['Central Hub', 'East District'], ['Central Hub', 'West District'],
    ['Central Hub', 'Downtown'], ['North District', 'Suburb North'],
    ['North District', 'Business Park'], ['South District', 'Suburb South'],
    ['East District', 'Tech Park'], ['East District', 'Residential East'],
    ['West District', 'Industrial Zone'], ['West District', 'Residential West'],
    ['Downtown', 'Shopping District'], ['Shopping District', 'Industrial Zone'],
    ['Tech Park', 'Business Park'], ['Residential East', 'Suburb South'],
    ['Residential West', 'Downtown'], ['Business Park', 'Tech Park'],
    ['Industrial Zone', 'South District'], ['Suburb North', 'Business Park']
];

let startPoint = 'Central Hub';
let endPoint = 'Central Hub';
let greedyRoute = [];

function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setupEventListeners();

    // Set default parcels
    areas['North District'].parcelCount = 3;
    areas['Shopping District'].parcelCount = 2;
    areas['Tech Park'].parcelCount = 2;
    areas['Residential East'].parcelCount = 1;
    areas['Downtown'].parcelCount = 2;

    renderAreaConfig();
    updateStats();
    render();
    syncLegendColors();

    showStatus('Ready! Configure deliveries and calculate fast route.', 'info');
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    render();
}

function setupEventListeners() {
    const sp = document.getElementById('startPoint');
    const ep = document.getElementById('endPoint');
    if (sp) sp.addEventListener('change', (e) => {
        startPoint = e.target.value;
        updateStats();
        render();
    });
    if (ep) ep.addEventListener('change', (e) => {
        endPoint = e.target.value;
        updateStats();
        render();
    });
}

function renderAreaConfig() {
    const container = document.getElementById('areaConfigList');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(areas).forEach(areaName => {
        const card = document.createElement('div');
        card.className = 'area-config-card';

        // Build parcel-details text safely
        const count = areas[areaName].parcelCount;
        const parcelDetailsText = count > 0 ? `${count} parcel${count > 1 ? 's' : ''}` : 'No deliveries';

        card.innerHTML = `
            <div class="area-config-header">
                <div class="area-config-name">
                    ${areaName}
                </div>
                <div class="parcel-controls">
                    <button class="btn-small btn-minus" onclick="changeParcelCount('${areaName}', -1)">−</button>
                    <input type="number" 
                           class="parcel-input" 
                           value="${areas[areaName].parcelCount}" 
                           min="0" 
                           max="99"
                           onchange="setParcelCount('${areaName}', this.value)">
                    <button class="btn-small btn-plus" onclick="changeParcelCount('${areaName}', 1)">+</button>
                </div>
            </div>
            <div class="parcel-details">
                ${parcelDetailsText}
            </div>
        `;
        container.appendChild(card);
    });
}

function changeParcelCount(areaName, delta) {
    const newCount = Math.max(0, Math.min(99, areas[areaName].parcelCount + delta));
    areas[areaName].parcelCount = newCount;
    renderAreaConfig();
    updateStats();
    render();
}

function setParcelCount(areaName, value) {
    const count = Math.max(0, Math.min(99, parseInt(value) || 0));
    areas[areaName].parcelCount = count;
    renderAreaConfig();
    updateStats();
    render();
}

function clearAllParcels() {
    Object.keys(areas).forEach(area => {
        areas[area].parcelCount = 0;
    });
    greedyRoute = [];
    renderAreaConfig();
    updateStats();
    render();
    const routeInfoEl = document.getElementById('routeInfo');
    if (routeInfoEl) routeInfoEl.classList.add('hidden');
    const summary = document.getElementById('routeSummaryContainer');
    if (summary) summary.innerHTML = '';
    showStatus('All parcels cleared!', 'success');
}

function resetToDefaults() {
    startPoint = 'Central Hub';
    endPoint = 'Central Hub';
    const sp = document.getElementById('startPoint');
    const ep = document.getElementById('endPoint');
    if (sp) sp.value = 'Central Hub';
    if (ep) ep.value = 'Central Hub';

    Object.keys(areas).forEach(area => {
        areas[area].parcelCount = 0;
    });

    areas['North District'].parcelCount = 3;
    areas['Shopping District'].parcelCount = 2;
    areas['Tech Park'].parcelCount = 2;
    areas['Residential East'].parcelCount = 1;
    areas['Downtown'].parcelCount = 2;

    greedyRoute = [];

    renderAreaConfig();
    updateStats();
    render();
    const routeInfoEl = document.getElementById('routeInfo');
    if (routeInfoEl) routeInfoEl.classList.add('hidden');
    const summary = document.getElementById('routeSummaryContainer');
    if (summary) summary.innerHTML = '';
    showStatus('Reset to default configuration!', 'success');
}

/* ----------------- Utility functions moved to top-level (used by many parts) ----------------- */

function getDistance(area1, area2) {
    const a1 = areas[area1];
    const a2 = areas[area2];
    return Math.hypot(a2.x - a1.x, a2.y - a1.y) * 0.05; // Scale for city distances
}

function calculateTotalDistance(route) {
    if (!route || route.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
        total += getDistance(route[i], route[i + 1]);
    }
    return total;
}

function calculateNearestNeighbor(areasToVisit) {
    const route = [startPoint];
    const unvisited = [...areasToVisit];
    let current = startPoint;

    while (unvisited.length > 0) {
        let nearest = null;
        let minDist = Infinity;

        unvisited.forEach(area => {
            const dist = getDistance(current, area);
            if (dist < minDist) {
                minDist = dist;
                nearest = area;
            }
        });

        route.push(nearest);
        current = nearest;
        unvisited.splice(unvisited.indexOf(nearest), 1);
    }

    if (endPoint !== route[route.length - 1]) {
        route.push(endPoint);
    }

    return route;
}

/* ----------------- Route calculation & display ----------------- */

function calculateGreedyRoute() {
    const areasWithParcels = Object.keys(areas).filter(a => areas[a].parcelCount > 0);

    // Only one parcel exists AND it's at the end point
    if (areasWithParcels.length === 1 && areasWithParcels[0] === endPoint) {
        greedyRoute = [startPoint, endPoint];

        displayRouteInfo();
        displayRouteSummary();
        updateStats();
        render();

        showStatus('Direct route calculated (only parcel at end city).', 'success');
        return;
    }

    // Normal case (parcels in other cities)
    const areasToVisit = [];
    areasWithParcels.forEach(area => {
        if (area !== startPoint && area !== endPoint) {
            areasToVisit.push(area);
        }
    });

    if (areasToVisit.length === 0) {
        showStatus('Please add parcels to at least one area!', 'warning');
        return;
    }

    // compute NN route
    const route = calculateNearestNeighbor(areasToVisit);
    greedyRoute = route;

    displayRouteInfo();
    displayRouteSummary();
    updateStats();
    render();

    showStatus('Greedy route calculated.', 'success');
}

function displayRouteInfo() {
    const container = document.getElementById('routeInfo');
    const stepsContainer = document.getElementById('routeSteps');
    if (!stepsContainer || !container) return;
    stepsContainer.innerHTML = '';

    greedyRoute.forEach((area, index) => {
        const step = document.createElement('div');
        step.className = 'route-step';

        const parcelsInArea = areas[area] ? areas[area].parcelCount : 0;
        let stopInfo;
        if (area === startPoint && index === 0) {
            stopInfo = 'Start';
        } else if (area === endPoint && index === greedyRoute.length - 1) {
            stopInfo = 'End';
        } else {
            stopInfo = parcelsInArea > 0 ? `${parcelsInArea} parcel${parcelsInArea !== 1 ? 's' : ''}` : 'Stop';
        }

        let distanceInfo = '';
        if (index < greedyRoute.length - 1) {
            const dist = getDistance(greedyRoute[index], greedyRoute[index + 1]);
            distanceInfo = `<div class="route-step-distance">${dist.toFixed(1)} km →</div>`;
        }

        step.innerHTML = `
            <div class="route-step-number">${index + 1}</div>
            <div class="route-step-content">
                <div class="route-step-area">${area}</div>
                <div class="route-step-details">${stopInfo}</div>
            </div>
            ${distanceInfo}
        `;

        stepsContainer.appendChild(step);
    });

    container.classList.remove('hidden');
}

function displayRouteSummary() {
    const container = document.getElementById('routeSummaryContainer');
    if (!container || !greedyRoute) return;
    const totalDist = calculateTotalDistance(greedyRoute);
    const totalParcels = greedyRoute.reduce((sum, area) => sum + (areas[area] ? areas[area].parcelCount : 0), 0);
    const estimatedTime = (totalDist * 3).toFixed(0); // ~3 min per km in city
    const numStops = Math.max(0, greedyRoute.length - 2);

    container.innerHTML = `
        <div class="route-summary">
            <h4>Greedy Route Summary</h4>
            <div class="route-stat">
                <span class="route-stat-label">Total Distance:</span>
                <span class="route-stat-value">${totalDist.toFixed(2)} km</span>
            </div>
            <div class="route-stat">
                <span class="route-stat-label">Delivery Stops:</span>
                <span class="route-stat-value">${numStops} area${numStops !== 1 ? 's' : ''}</span>
            </div>
            <div class="route-stat">
                <span class="route-stat-label">Total Parcels:</span>
                <span class="route-stat-value">${totalParcels}</span>
            </div>
            <div class="route-stat">
                <span class="route-stat-label">Estimated Time:</span>
                <span class="route-stat-value">${estimatedTime} minutes</span>
            </div>
            <div class="speed-badge">
                Fast Algorithm - Instant Results
            </div>
        </div>
    `;
}

function updateStats() {
    let totalParcels = 0;
    let areasWithParcels = 0;

    Object.keys(areas).forEach(area => {
        totalParcels += areas[area].parcelCount;
        if (areas[area].parcelCount > 0) areasWithParcels++;
    });

    const totalParcelsEl = document.getElementById('totalParcels');
    const totalAreasEl = document.getElementById('totalAreas');
    const totalDistanceEl = document.getElementById('totalDistance');
    const estimatedTimeEl = document.getElementById('estimatedTime');

    if (totalParcelsEl) totalParcelsEl.textContent = totalParcels;
    if (totalAreasEl) totalAreasEl.textContent = areasWithParcels;

    if (greedyRoute.length > 0) {
        const dist = calculateTotalDistance(greedyRoute);
        if (totalDistanceEl) totalDistanceEl.textContent = dist.toFixed(1);
        if (estimatedTimeEl) estimatedTimeEl.textContent = (dist * 3).toFixed(0);
    } else {
        if (totalDistanceEl) totalDistanceEl.textContent = '0';
        if (estimatedTimeEl) estimatedTimeEl.textContent = '0';
    }
}

function showStatus(message, type) {
    const container = document.getElementById('statusContainer');
    if (!container) return;
    const statusClass = `status-${type}`;
    const icon = type === 'success' ? '✔️' : type === 'warning' ? '⚠️' : 'ℹ️';
    container.innerHTML = `<div class="status-message ${statusClass}">${icon} ${message}</div>`;
}

function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background - light blue for city
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e8e8e8');
    gradient.addColorStop(1, '#e8e8e8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw city grid pattern
    drawCityGrid();

    // Draw road network
    drawRoadNetwork();

    // Draw greedy route
    if (greedyRoute.length > 1) {
        drawGreedyRoute(greedyRoute);
    }

    // Draw areas
    Object.keys(areas).forEach(areaName => {
        drawArea(areaName, areas[areaName]);
    });
}

function drawCityGrid() {
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.3)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawRoadNetwork() {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);

    roadNetwork.forEach(road => {
        const area1 = areas[road[0]];
        const area2 = areas[road[1]];
        if (!area1 || !area2) return;

        ctx.beginPath();
        ctx.moveTo(area1.x, area1.y);
        ctx.lineTo(area2.x, area2.y);
        ctx.stroke();
    });

    ctx.setLineDash([]);
}

function drawGreedyRoute(route) {
    // Shadow
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    for (let i = 0; i < route.length; i++) {
        const area = areas[route[i]];
        if (!area) continue;
        if (i === 0) {
            ctx.moveTo(area.x, area.y);
        } else {
            ctx.lineTo(area.x, area.y);
        }
    }
    ctx.stroke();

    // Main route
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 7;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    for (let i = 0; i < route.length; i++) {
        const area = areas[route[i]];
        if (!area) continue;
        if (i === 0) {
            ctx.moveTo(area.x, area.y);
        } else {
            ctx.lineTo(area.x, area.y);
        }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Arrows
    for (let i = 0; i < route.length - 1; i++) {
        const a1 = areas[route[i]];
        const a2 = areas[route[i + 1]];
        if (!a1 || !a2) continue;
        drawArrow(a1.x, a1.y, a2.x, a2.y);
    }
}

function drawArrow(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);

    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-8, -8);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawArea(areaName, area) {
    const isStart = areaName === startPoint;
    const isEnd = areaName === endPoint && startPoint !== endPoint;
    const hasSelection = area.parcelCount > 0;
    const parcelCount = area.parcelCount;

    let pinColor;
    if (isStart) {
        pinColor = '#2c3e50';
    } else if (isEnd) {
        pinColor = '#666666';
    } else if (hasSelection) {
        pinColor = '#555555';
    } else {
        pinColor = '#9ca3af';
    }

    const pinSize = (isStart || isEnd) ? 18 : 14;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(area.x + 2, area.y + 2, pinSize, 0, Math.PI * 2);
    ctx.fill();

    // Pin circle
    ctx.fillStyle = pinColor;
    ctx.beginPath();
    ctx.arc(area.x, area.y, pinSize, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner dot
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(area.x, area.y, pinSize * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Area name
    const labelY = area.y + 30;

    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    const textWidth = ctx.measureText(areaName).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 4;
    ctx.fillRect(area.x - textWidth / 2 - 6, labelY - 10, textWidth + 12, 18);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(area.x - textWidth / 2 - 6, labelY - 10, textWidth + 12, 18);

    ctx.fillStyle = '#1f2937';
    ctx.fillText(areaName, area.x, labelY);

    // Parcel badge
    if (parcelCount > 0) {
        const badgeX = area.x + pinSize + 3;
        const badgeY = area.y - pinSize - 3;

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(parcelCount, badgeX, badgeY);
    }
}

window.addEventListener('load', init);

/* ---------- Legend color sync (keeps legend identical to canvas visuals) ---------- */
function syncLegendColors() {
    // Colors used in your draw functions (keep these in sync if you change map colors)
    const routeColor = '#2c3e50';
    const routeShadow = 'rgba(16,185,129,0.35)';
    const roadColor = '#cbd5e1';
    const startColor = '#2c3e50';
    const endColor = '#666666';
    const deliveryColor = '#555555';
    const parcelColor = '#ef4444';

    // set SVG fills / strokes by class
    document.querySelectorAll('.svg-fill-route').forEach(el => el.setAttribute('fill', routeColor));
    document.querySelectorAll('.svg-stroke-route').forEach(el => el.setAttribute('stroke', routeColor));
    document.querySelectorAll('.svg-shadow-route').forEach(el => el.setAttribute('stroke', routeShadow));
    document.querySelectorAll('.svg-stroke-road').forEach(el => el.setAttribute('stroke', roadColor));
    document.querySelectorAll('.svg-fill-start').forEach(el => el.setAttribute('fill', startColor));
    document.querySelectorAll('.svg-fill-end').forEach(el => el.setAttribute('fill', endColor));
    document.querySelectorAll('.svg-fill-delivery').forEach(el => el.setAttribute('fill', deliveryColor));
    document.querySelectorAll('.svg-fill-parcel').forEach(el => el.setAttribute('fill', parcelColor));
}

if (typeof init === 'function') {
    window.addEventListener('load', () => {
        syncLegendColors();
    });
}
