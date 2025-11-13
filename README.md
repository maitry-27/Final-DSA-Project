# Delivery Route Planning System

A dual-module Data Structures & Algorithms project that provides **Intra-City fast delivery routing** and **Inter-City optimal route planning** using Greedy and TSP algorithms.

This repository contains two independent routing systems:

- **City Area Delivery Planner (Intra-City)** — Uses the *Greedy Nearest-Neighbour* algorithm  
- **Optimal Route Planner (Inter-City)** — Uses the *Exact Traveling Salesman Problem (TSP)* algorithm

---

## Overview

This project includes **two complete delivery-routing systems**:

### 1. City Area Delivery Planner (Intra-City)  
Built for fast intra-city delivery using the **Greedy Nearest-Neighbour Algorithm**.

### 2. Optimal Route Planner (Inter-City)  
Calculates exact shortest routes using a **full permutation-based TSP solution**.

Both systems feature interactive visualization, parcel input, and route summaries.

---

# Modules

---

## 1. Intra-City Delivery Planner (Greedy)

A real-time tool for calculating fast delivery routes across 14 city zones.

### Features
- Real-time route generation  
- Canvas-based city map  
- Supports multiple delivery areas  
- Fast computation  
- Clear visual route display  

---

### Algorithm Used – Greedy Nearest Neighbour

#### Step-by-step:
1. **Start at the chosen location**  
2. **Select the closest unvisited area**  
3. **Move to that area and mark it as visited**  
4. **Repeat until all delivery areas are visited**

---

### Performance
- **Time Complexity:** O(n²)  
- Works efficiently for **50+ areas**  
- Accuracy: **~85–95% of optimal**  

---

## 2. Inter-City Optimal Route Planner (TSP)

A routing system that computes the **exact shortest path** between major Indian cities.

### Features
- Fully optimal routes  
- Interactive India map  
- Parcel quantity input  
- Start & end city customization  
- Visual route trace and summary  

---

### Algorithm – Exact TSP

The system:
- Generates **all possible city permutations**
- Computes **total distance for each**
- Selects the **shortest possible route**

---

### Performance
- **Time Complexity:** O(n!)  
- Ideal for high-accuracy logistics planning  
- Extremely accurate but slower  

---

# Algorithms Used

## Greedy Nearest Neighbour  
Used for **intra-city** delivery.  
Chooses the nearest next unvisited area at every step.

## Exact TSP  
Used for **inter-city** delivery.  
Guarantees shortest possible route via full permutation search.


---
# Project Structure
```

Final-DSA-Project/  
│  
├── Intra city/  
│   ├── index.html  
│   ├── css/  
│   │   └── styles.css  
│   └── js/  
│       └── main.js  
│  
└── Inter city/  
    ├── index.html  
    ├── css/  
    │   └── styles.css  
    └── js/  
        └── main.js  
```
---


# How to Use

## For Both Planners:
1. Open the relevant **index.html**  
2. Choose **start** and **end** locations  
3. Enter **parcel quantities**  
4. Click:
   - **Calculate Fast Route** → Intra-City  
   - **Find Optimal Route** → Inter-City  
5. View:
   - Route drawn on the map  
   - Delivery sequence  
   - Total distance  
   - Estimated time  

---

# Feature Comparison

| Feature               | Intra-City (Greedy)      | Inter-City (TSP Optimal) |
|----------------------|---------------------------|---------------------------|
| Algorithm Type       | Nearest Neighbour        | Exact TSP                |
| Speed                | Fast                     | Slow (Factorial)         |
| Accuracy             | ~85–95%                  | 100%                     |
| Best Use Case        | Quick delivery           | Logistics planning       |
| Scale                | 50+ areas                | ≤ 10 cities              |

---

# Contributors

- **Satyam Varu (B24EE1086)**  
- **Arni Godiawala (B24EE1021)**  
- **Maitry Gami (B24CS1041)**  

---
