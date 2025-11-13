        const canvas = document.getElementById('mapCanvas');
        const ctx = canvas.getContext('2d');

        // Cities with coordinates
        const cities = {
            'Delhi': {x: 500, y: 180, parcelCount: 0},
            'Mumbai': {x: 300, y: 400, parcelCount: 0},
            'Bangalore': {x: 400, y: 550, parcelCount: 0},
            'Kolkata': {x: 750, y: 280, parcelCount: 0},
            'Chennai': {x: 550, y: 570, parcelCount: 0},
            'Hyderabad': {x: 450, y: 450, parcelCount: 0},
            'Ahmedabad': {x: 300, y: 300, parcelCount: 0},
            'Pune': {x: 340, y: 430, parcelCount: 0},
            'Jaipur': {x: 420, y: 240, parcelCount: 0},
            'Lucknow': {x: 580, y: 240, parcelCount: 0},
            'Chandigarh': {x: 460, y: 150, parcelCount: 0},
            'Indore': {x: 400, y: 330, parcelCount: 0}
        };

        // Road network
        const roadNetwork = [
            ['Delhi', 'Chandigarh'], ['Delhi', 'Jaipur'], ['Delhi', 'Lucknow'],
            ['Chandigarh', 'Jaipur'], ['Jaipur', 'Ahmedabad'], ['Jaipur', 'Indore'],
            ['Lucknow', 'Kolkata'], ['Ahmedabad', 'Mumbai'], ['Ahmedabad', 'Indore'],
            ['Mumbai', 'Pune'], ['Pune', 'Hyderabad'], ['Indore', 'Hyderabad'],
            ['Hyderabad', 'Bangalore'], ['Hyderabad', 'Chennai'], ['Bangalore', 'Chennai'],
            ['Chennai', 'Kolkata'], ['Delhi', 'Indore'], ['Mumbai', 'Bangalore'],
            ['Kolkata', 'Hyderabad']
        ];

        let startPoint = 'Delhi';
        let endPoint = 'Delhi';
        let optimalRoute = [];

        function init() {
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            setupEventListeners();
            
            // Set default parcels
            cities['Mumbai'].parcelCount = 3;
            cities['Bangalore'].parcelCount = 2;
            cities['Chennai'].parcelCount = 2;
            cities['Hyderabad'].parcelCount = 1;
            
            renderCityConfig();
            updateStats();
            render();
            
            showStatus('Ready! Configure your deliveries and find the optimal route.', 'info');
        }

        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            render();
        }

        function setupEventListeners() {
            document.getElementById('startPoint').addEventListener('change', (e) => {
                startPoint = e.target.value;
                updateStats();
                render();
            });

            document.getElementById('endPoint').addEventListener('change', (e) => {
                endPoint = e.target.value;
                updateStats();
                render();
            });
        }

        function renderCityConfig() {
            const container = document.getElementById('cityConfigList');
            container.innerHTML = '';

            Object.keys(cities).forEach(cityName => {
                const card = document.createElement('div');
                card.className = 'city-config-card';
                card.innerHTML = `
                    <div class="city-config-header">
                        <div class="city-config-name">
                            ${cityName}
                        </div>
                        <div class="parcel-controls">
                            <button class="btn-small btn-minus" onclick="changeParcelCount('${cityName}', -1)">−</button>
                            <input type="number" 
                                   class="parcel-input" 
                                   value="${cities[cityName].parcelCount}" 
                                   min="0" 
                                   max="99"
                                   onchange="setParcelCount('${cityName}', this.value)">
                            <button class="btn-small btn-plus" onclick="changeParcelCount('${cityName}', 1)">+</button>
                        </div>
                    </div>
                    <div class="parcel-details">
                        ${cities[cityName].parcelCount > 0 ? 
                          `${cities[cityName].parcelCount} parcel${cities[cityName].parcelCount > 1 ? 's' : ''} to deliver` : 
                          'No parcels'}
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function changeParcelCount(cityName, delta) {
            const newCount = Math.max(0, Math.min(99, cities[cityName].parcelCount + delta));
            cities[cityName].parcelCount = newCount;
            renderCityConfig();
            updateStats();
            render();
        }

        function setParcelCount(cityName, value) {
            const count = Math.max(0, Math.min(99, parseInt(value) || 0));
            cities[cityName].parcelCount = count;
            renderCityConfig();
            updateStats();
            render();
        }

        function clearAllParcels() {
            Object.keys(cities).forEach(city => {
                cities[city].parcelCount = 0;
            });
            optimalRoute = [];
            renderCityConfig();
            updateStats();
            render();
            document.getElementById('routeInfo').classList.add('hidden');
            document.getElementById('routeSummaryContainer').innerHTML = '';
            showStatus('All parcels cleared!', 'success');
        }

        function resetToDefaults() {
            startPoint = 'Delhi';
            endPoint = 'Delhi';
            document.getElementById('startPoint').value = 'Delhi';
            document.getElementById('endPoint').value = 'Delhi';
            
            Object.keys(cities).forEach(city => {
                cities[city].parcelCount = 0;
            });
            
            cities['Mumbai'].parcelCount = 3;
            cities['Bangalore'].parcelCount = 2;
            cities['Chennai'].parcelCount = 2;
            cities['Hyderabad'].parcelCount = 1;
            
            optimalRoute = [];
            
            renderCityConfig();
            updateStats();
            render();
            document.getElementById('routeInfo').classList.add('hidden');
            document.getElementById('routeSummaryContainer').innerHTML = '';
            showStatus('Reset to default configuration!', 'success');
        }

        function calculateOptimalRoute() {

    // 1. Collect cities that require visiting
    const citiesToVisit = [];
    Object.keys(cities).forEach(city => {
        if (cities[city].parcelCount > 0) {
            if (city !== startPoint && city !== endPoint) {
                citiesToVisit.push(city);
            }
        }
    });

    // 2. If parcels exist ONLY in start or end city → direct route
    const totalParcels = Object.values(cities).reduce((sum, c) => sum + c.parcelCount, 0);

    if (citiesToVisit.length === 0 && totalParcels > 0) {
        optimalRoute = [startPoint, endPoint];

        displayRouteInfo();
        displayRouteSummary();
        updateStats();
        render();

        showStatus("Parcel is already at start or end city — no extra stops needed.", "success");
        return;
    }

    // 3. If no parcel anywhere → warning
    if (totalParcels === 0) {
        showStatus("Please add parcels to at least one city!", "warning");
        return;
    }

    // 4. Continue with normal TSP
    const startTime = performance.now();
    optimalRoute = calculateOptimalTSP(citiesToVisit);
    const endTime = performance.now();

    const dist = calculateTotalDistance(optimalRoute);
    const computeTime = (endTime - startTime).toFixed(2);

    showStatus(`Optimal route found! Distance: ${dist.toFixed(2)} km (computed in ${computeTime}ms)`, 'success');

    displayRouteInfo();
    displayRouteSummary();
    updateStats();
    render();
}


        function calculateOptimalTSP(citiesToVisit) {
            if (citiesToVisit.length <= 10) {
                // Exact solution for small problems
                let bestRoute = null;
                let bestDistance = Infinity;

                const permutations = getPermutations(citiesToVisit);

                permutations.forEach(perm => {
                    let route = [startPoint, ...perm];
                    if (endPoint !== route[route.length - 1]) {
                        route.push(endPoint);
                    }
                    const distance = calculateTotalDistance(route);
                    
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestRoute = route;
                    }
                });

                return bestRoute || [startPoint, endPoint];
            } else {
                // Use 2-Opt for larger problems
                return calculate2OptTSP(citiesToVisit);
            }
        }

        function calculate2OptTSP(citiesToVisit) {
            // Start with nearest neighbor
            let route = [startPoint];
            const unvisited = [...citiesToVisit];
            let current = startPoint;

            while (unvisited.length > 0) {
                let nearest = null;
                let minDist = Infinity;

                unvisited.forEach(city => {
                    const dist = getDistance(current, city);
                    if (dist < minDist) {
                        minDist = dist;
                        nearest = city;
                    }
                });

                route.push(nearest);
                current = nearest;
                unvisited.splice(unvisited.indexOf(nearest), 1);
            }

            if (endPoint !== route[route.length - 1]) {
                route.push(endPoint);
            }

            // Improve with 2-Opt
            let improved = true;
            while (improved) {
                improved = false;
                for (let i = 1; i < route.length - 2; i++) {
                    for (let j = i + 1; j < route.length - 1; j++) {
                        const newRoute = twoOptSwap(route, i, j);
                        const newDistance = calculateTotalDistance(newRoute);
                        const oldDistance = calculateTotalDistance(route);
                        
                        if (newDistance < oldDistance) {
                            route = newRoute;
                            improved = true;
                        }
                    }
                }
            }
            
            return route;
        }

        function twoOptSwap(route, i, j) {
            const newRoute = route.slice(0, i);
            const reversed = route.slice(i, j + 1).reverse();
            const end = route.slice(j + 1);
            return [...newRoute, ...reversed, ...end];
        }

        function getPermutations(arr) {
            if (arr.length <= 1) return [arr];
            const result = [];
            
            for (let i = 0; i < arr.length; i++) {
                const current = arr[i];
                const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
                const remainingPerms = getPermutations(remaining);
                
                for (let perm of remainingPerms) {
                    result.push([current, ...perm]);
                }
            }
            
            return result;
        }

        const manualDistances = {
  "Delhi": {
    "Mumbai": 1418,
    "Bangalore": 2147,
    "Kolkata": 1570,
    "Chennai": 2200,
    "Hyderabad": 1567,
    "Ahmedabad": 940,
    "Pune": 1471,
    "Jaipur": 287,
    "Lucknow": 500,
    "Chandigarh": 256,
    "Indore": 830
  },
  "Mumbai": {
    "Delhi": 1418,
    "Bangalore": 985,
    "Kolkata": 1960,
    "Chennai": 1335,
    "Hyderabad": 710,
    "Ahmedabad": 530,
    "Pune": 150,
    "Jaipur": 1150,
    "Lucknow": 1400,
    "Chandigarh": 1600,
    "Indore": 580
  },
  "Bangalore": {
    "Delhi": 2147,
    "Mumbai": 985,
    "Kolkata": 1918,
    "Chennai": 340,
    "Hyderabad": 570,
    "Ahmedabad": 1565,
    "Pune": 840,
    "Jaipur": 2144,
    "Lucknow": 1900,
    "Chandigarh": 2328,
    "Indore": 1357
  },
  "Kolkata": {
    "Delhi": 1570,
    "Mumbai": 1960,
    "Bangalore": 1918,
    "Chennai": 1660,
    "Hyderabad": 1460,
    "Ahmedabad": 2000,
    "Pune": 1900,
    "Jaipur": 1600,
    "Lucknow": 1000,
    "Chandigarh": 1800,
    "Indore": 1600
  },
  "Chennai": {
    "Delhi": 2200,
    "Mumbai": 1335,
    "Bangalore": 340,
    "Kolkata": 1660,
    "Hyderabad": 630,
    "Ahmedabad": 1820,
    "Pune": 1200,
    "Jaipur": 2230,
    "Lucknow": 1900,
    "Chandigarh": 2463,
    "Indore": 1440
  },
  "Hyderabad": {
    "Delhi": 1567,
    "Mumbai": 710,
    "Bangalore": 570,
    "Kolkata": 1460,
    "Chennai": 630,
    "Ahmedabad": 1218,
    "Pune": 560,
    "Jaipur": 1500,
    "Lucknow": 1285,
    "Chandigarh": 1833,
    "Indore": 961
  },
  "Ahmedabad": {
    "Delhi": 940,
    "Mumbai": 530,
    "Bangalore": 1565,
    "Kolkata": 2000,
    "Chennai": 1820,
    "Hyderabad": 1218,
    "Pune": 656,
    "Jaipur": 653,
    "Lucknow": 1182,
    "Chandigarh": 1175,
    "Indore": 389
  },
  "Pune": {
    "Delhi": 1471,
    "Mumbai": 150,
    "Bangalore": 840,
    "Kolkata": 1900,
    "Chennai": 1200,
    "Hyderabad": 560,
    "Ahmedabad": 656,
    "Jaipur": 1150,
    "Lucknow": 1450,
    "Chandigarh": 1650,
    "Indore": 650
  },
  "Jaipur": {
    "Delhi": 287,
    "Mumbai": 1150,
    "Bangalore": 2144,
    "Kolkata": 1600,
    "Chennai": 2230,
    "Hyderabad": 1500,
    "Ahmedabad": 653,
    "Pune": 1150,
    "Lucknow": 600,
    "Chandigarh": 500,
    "Indore": 560
  },
  "Lucknow": {
    "Delhi": 500,
    "Mumbai": 1400,
    "Bangalore": 1900,
    "Kolkata": 1000,
    "Chennai": 1900,
    "Hyderabad": 1285,
    "Ahmedabad": 1182,
    "Pune": 1450,
    "Jaipur": 600,
    "Chandigarh": 720,
    "Indore": 900
  },
  "Chandigarh": {
    "Delhi": 256,
    "Mumbai": 1600,
    "Bangalore": 2328,
    "Kolkata": 1800,
    "Chennai": 2463,
    "Hyderabad": 1833,
    "Ahmedabad": 1175,
    "Pune": 1650,
    "Jaipur": 500,
    "Lucknow": 720,
    "Indore": 1154
  },
  "Indore": {
    "Delhi": 830,
    "Mumbai": 580,
    "Bangalore": 1357,
    "Kolkata": 1600,
    "Chennai": 1440,
    "Hyderabad": 961,
    "Ahmedabad": 389,
    "Pune": 650,
    "Jaipur": 560,
    "Lucknow": 900,
    "Chandigarh": 1154
  }
};


        function getDistance(city1, city2) {
    if (city1 === city2) return 0;

    if (manualDistances[city1] && manualDistances[city1][city2]) {
        return manualDistances[city1][city2];
    }

    if (manualDistances[city2] && manualDistances[city2][city1]) {
        return manualDistances[city2][city1];
    }

    console.warn(`Distance missing: ${city1} <-> ${city2}`);
    return 999999; // avoid using unknown routes
}


        function calculateTotalDistance(route) {
            let total = 0;
            for (let i = 0; i < route.length - 1; i++) {
                total += getDistance(route[i], route[i + 1]);
            }
            return total;
        }

        function displayRouteInfo() {
            const container = document.getElementById('routeInfo');
            const stepsContainer = document.getElementById('routeSteps');
            stepsContainer.innerHTML = '';

            optimalRoute.forEach((city, index) => {
                const step = document.createElement('div');
                step.className = 'route-step';
                
                const parcelsInCity = cities[city].parcelCount;
                let stopInfo;
                if (city === startPoint && index === 0) {
                    stopInfo = 'Departure';
                } else if (city === endPoint && index === optimalRoute.length - 1) {
                    stopInfo = 'Final destination';
                } else {
                    stopInfo = parcelsInCity > 0 ? 
                        `Deliver ${parcelsInCity} parcel${parcelsInCity !== 1 ? 's' : ''}` : 
                        'Stopover';
                }
                
                let distanceInfo = '';
                if (index < optimalRoute.length - 1) {
                    const dist = getDistance(optimalRoute[index], optimalRoute[index + 1]);
                    distanceInfo = `<div class="route-step-distance">${dist.toFixed(0)} km →</div>`;
                }
                
                step.innerHTML = `
                    <div class="route-step-number">${index + 1}</div>
                    <div class="route-step-content">
                        <div class="route-step-city">${city}</div>
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
            const totalDist = calculateTotalDistance(optimalRoute);
            const totalParcels = optimalRoute.reduce((sum, city) => sum + cities[city].parcelCount, 0);
            const estimatedTime = (totalDist / 60).toFixed(1);
            const numStops = optimalRoute.length - 2;

            container.innerHTML = `
                <div class="route-summary">
                    <h4>Optimal Route Summary</h4>
                    <div class="route-stat">
                        <span class="route-stat-label">Total Distance:</span>
                        <span class="route-stat-value">${totalDist.toFixed(2)} km</span>
                    </div>
                    <div class="route-stat">
                        <span class="route-stat-label">Delivery Stops:</span>
                        <span class="route-stat-value">${numStops} ${numStops === 1 ? 'city' : 'cities'}</span>
                    </div>
                    <div class="route-stat">
                        <span class="route-stat-label">Total Parcels:</span>
                        <span class="route-stat-value">${totalParcels}</span>
                    </div>
                    <div class="route-stat">
                        <span class="route-stat-label">Estimated Time:</span>
                        <span class="route-stat-value">${estimatedTime} hours</span>
                    </div>
                    <div class="optimization-badge">
                        Shortest Possible Route
                    </div>
                </div>
            `;
        }

        function updateStats() {
            let totalParcels = 0;
            let citiesWithParcels = 0;
            
            Object.keys(cities).forEach(city => {
                totalParcels += cities[city].parcelCount;
                if (cities[city].parcelCount > 0) citiesWithParcels++;
            });
            
            document.getElementById('totalParcels').textContent = totalParcels;
            document.getElementById('totalCities').textContent = citiesWithParcels;
            
            if (optimalRoute.length > 0) {
                const dist = calculateTotalDistance(optimalRoute);
                document.getElementById('totalDistance').textContent = dist.toFixed(0);
                document.getElementById('estimatedTime').textContent = (dist / 60).toFixed(1);
            } else {
                document.getElementById('totalDistance').textContent = '0';
                document.getElementById('estimatedTime').textContent = '0';
            }
        }

        function showStatus(message, type) {
            const container = document.getElementById('statusContainer');
            const statusClass = `status-${type}`;
            const icon = type === 'success' ? '' : type === 'warning' ? '' : '';
            container.innerHTML = `<div class="status-message ${statusClass}">${icon} ${message}</div>`;
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f8fafc');
            gradient.addColorStop(1, '#e2e8f0');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw road network
            drawRoadNetwork();
            
            // Draw optimal route
            if (optimalRoute.length > 1) {
                drawOptimalRoute(optimalRoute);
            }
            
            // Draw cities
            Object.keys(cities).forEach(cityName => {
                drawCity(cityName, cities[cityName]);
            });
        }

        function drawRoadNetwork() {
            ctx.strokeStyle ='#CED4DA';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            
            roadNetwork.forEach(road => {
                const city1 = cities[road[0]];
                const city2 = cities[road[1]];
                
                ctx.beginPath();
                ctx.moveTo(city1.x, city1.y);
                ctx.lineTo(city2.x, city2.y);
                ctx.stroke();
            });
            
            ctx.setLineDash([]);
        }

        function drawOptimalRoute(route) {
            // Shadow
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            for (let i = 0; i < route.length; i++) {
                const city = cities[route[i]];
                if (i === 0) {
                    ctx.moveTo(city.x, city.y);
                } else {
                    ctx.lineTo(city.x, city.y);
                }
            }
            ctx.stroke();
            
            // Main route
            ctx.strokeStyle = '#212529';   // Dark charcoal route
            ctx.lineWidth = 7;
            ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
            ctx.shadowBlur = 12;
            
            ctx.beginPath();
            for (let i = 0; i < route.length; i++) {
                const city = cities[route[i]];
                if (i === 0) {
                    ctx.moveTo(city.x, city.y);
                } else {
                    ctx.lineTo(city.x, city.y);
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Arrows
            for (let i = 0; i < route.length - 1; i++) {
                const c1 = cities[route[i]];
                const c2 = cities[route[i + 1]];
                drawArrow(c1.x, c1.y, c2.x, c2.y);
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

        function drawCity(cityName, city) {
            const isStart = cityName === startPoint;
            const isEnd = cityName === endPoint && startPoint !== endPoint;
            const hasSelection = city.parcelCount > 0;
            const parcelCount = city.parcelCount;
            
            // Determine pin color
            let pinColor;

if (isStart) {
    pinColor = '#0D6EFD';        // Blue Start City
} 
else if (isEnd) {
    pinColor = '#DC3545';        // Red End City
} 
else if (hasSelection) {
    pinColor = '#198754';        // Green Delivery City
} 
else {
    pinColor = '#6C757D';        // Gray Normal City
}
            
            const pinSize = (isStart || isEnd) ? 20 : 16;
            
            // Pin shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(city.x + 2, city.y + 2, pinSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Pin circle
            ctx.fillStyle = pinColor;
            ctx.beginPath();
            ctx.arc(city.x, city.y, pinSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Pin border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Inner dot
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(city.x, city.y, pinSize * 0.35, 0, Math.PI * 2);
            ctx.fill();
            
            // City name
            const labelY = city.y + 35;
            
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            const textWidth = ctx.measureText(cityName).width;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 4;
            ctx.fillRect(city.x - textWidth / 2 - 8, labelY - 12, textWidth + 16, 22);
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 1;
            ctx.strokeRect(city.x - textWidth / 2 - 8, labelY - 12, textWidth + 16, 22);
            
            ctx.fillStyle = '#1f2937';
            ctx.fillText(cityName, city.x, labelY);
            
            // Parcel badge
            if (parcelCount > 0) {
                const badgeX = city.x + pinSize + 4;
                const badgeY = city.y - pinSize - 4;
                
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(badgeX, badgeY, 14, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.font = 'bold 11px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(parcelCount, badgeX, badgeY);
            }
        }

        window.addEventListener('load', init);
