Delivery Route Planning System

A dual-module Data Structures & Algorithms project featuring Intra-City Greedy Routing and Inter-City Optimal TSP Path Calculation.

This repository contains two independent but related routing systems:

City Area Delivery Planner (Intra-City) — Uses the Greedy Nearest-Neighbour algorithm

Optimal Route Planner (Inter-City) — Uses the Exact Traveling Salesman Problem (TSP) algorithm

📦 Modules Overview
1. City Area Delivery Planner (Intra-City)

An intra-city routing tool using the Greedy Nearest Neighbour algorithm for fast, efficient path calculation across multiple delivery zones.

Features

Fast nearest-neighbour routing

Interactive map of city areas

Visual delivery sequence

Instant computation even for many locations

Algorithm Used – Greedy Nearest Neighbour
1. Start at the chosen location

The algorithm begins from the user-selected starting area. This is the first visited point.

2. Select the closest unvisited area

From the current position, the algorithm computes distances to all areas that still have pending deliveries.
It selects the area with the shortest distance among the unvisited locations.

3. Move to that area and mark it as visited

After selecting the nearest area, the system moves to that location.
Once reached, it marks that area as visited so it won't be selected again.

4. Repeat until all delivery areas are visited

The process repeats:

From the new current location, check all unvisited areas

Choose the closest one

Go there and mark as visited

This loop continues until every required delivery location is visited.

Performance

Time Complexity: O(n²)

Efficient for 50+ intra-city stops

Typically achieves ~85% optimal accuracy

2. Optimal Route Planner (Inter-City)

A route optimization system using the Exact TSP algorithm to compute the mathematically shortest path between major Indian cities.

Features

Fully optimal TSP route

Interactive India map

Start/end customization

Delivery quantity selection

Visualized route and summary (distance + time)

Algorithm – Exact TSP

Computes all possible route permutations

Selects the shortest total path

Guaranteed optimal as long as the city count ≤ 10

Performance

Time Complexity: O(n!)

Best suited for high-accuracy inter-city logistics planning

📁 Project Structure
Final-DSA-Project/
│
├── Intra city/                     # City Area Delivery Planner
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
│
└── Inter city/                     # Optimal Route Planner (TSP)
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        └── main.js

▶️ How to Use
For both planners:

Open the respective index.html file in any modern browser

Choose start and end locations

Enter parcel quantities if required

Click:

“Calculate Fast Route” for the Intra-City Greedy Planner

“Find Optimal Route” for the Inter-City TSP Planner

View:

Route drawn on the map

Step-wise delivery sequence

Total distance & estimated time

📊 Feature Comparison
Feature	Intra-City (Greedy)	Inter-City (TSP Optimal)
Algorithm Type	Nearest Neighbour	Exact TSP
Speed	Very Fast	Slow (Factorial)
Accuracy	~85–95%	100%
Scale	50+ areas	≤ 10 cities
Use Case	Quick commerce delivery	Logistics route planning

👥 Contributors

Satyam Varu (B24EE1086)

Arni Godiawala (B24EE1021)

Maitry Gami (B24CS1041)
