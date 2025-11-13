# 🚚 Delivery Route Planning System

A dual-module Data Structures & Algorithms project that provides **Intra-City fast delivery routing** and **Inter-City optimal route planning** using Greedy and TSP algorithms.

---

## 📚 Table of Contents
- [Overview](#overview)
- [Modules](#modules)
  - [Intra-City Delivery Planner](#1-intra-city-delivery-planner-greedy)
  - [Inter-City Optimal Route Planner](#2-inter-city-optimal-route-planner-tsp)
- [Algorithms Used](#algorithms-used)
- [Project Structure](#project-structure)
- [How to Use](#how-to-use)
- [Feature Comparison](#feature-comparison)
- [Contributors](#contributors)

---

## 📘 Overview
This project contains **two independent routing systems**:

1. **City Area Delivery Planner (Intra-City)** – Fast route calculation using **Greedy Nearest-Neighbour**  
2. **Optimal Route Planner (Inter-City)** – Mathematically shortest route using **Exact TSP**

Both systems include interactive maps, dynamic delivery inputs, and route visualization.

---

## 🧭 Modules

---

## **1. Intra-City Delivery Planner (Greedy)**

An intra-city tool that calculates fast delivery routes across 14 areas using the **Greedy Nearest Neighbour** algorithm.

### ⭐ Features
- Real-time route generation  
- Canvas-based city visual map  
- Supports multiple delivery zones  
- Instant calculation and updates  
- Clean user interface  

### 🧠 Algorithm Used – Greedy Nearest Neighbour

1. **Start at the chosen location**  
2. **Select the closest unvisited area**  
3. **Move to that area and mark it as visited**  
4. **Repeat until all delivery areas are visited**

### 📈 Performance
- **Time Complexity:** O(n²)  
- Efficient for **50+ delivery points**  
- ~85–95% route optimality  

---

## **2. Inter-City Optimal Route Planner (TSP)**

A system that computes the exact shortest possible route between selected major Indian cities.

### ⭐ Features
- Precise TSP-based route optimization  
- Interactive map  
- Delivery quantity selection  
- Route drawing + summary (distance & time)  
- Custom start & end city  

### 🧠 Algorithm – Exact TSP
- Evaluates **all permutations**
- Guarantees **100% optimal** route
- Best for **≤ 10 cities**

### 📈 Performance
- **Time Complexity:** O(n!)**  
- Used for **high-accuracy logistics planning**

---

## 🧮 Algorithms Used

### **Greedy Nearest Neighbour**  
Used for intra-city routing.  
Fast, scalable, picks next closest location locally.

### **Exact TSP (Traveling Salesman Problem)**  
Used for inter-city routing.  
Computes globally optimal shortest path.

---

## 📁 Project Structure

