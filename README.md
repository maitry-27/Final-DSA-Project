```{=html}
<h1 style="font-size:40px;">
```
Delivery Route Planning System
```{=html}
</h1>
```
A dual-module Data Structures & Algorithms project featuring
`<b>`{=html}Intra-City Greedy Routing`</b>`{=html} and
`<b>`{=html}Inter-City Optimal TSP Path Calculation`</b>`{=html}.

This repository contains two independent but related routing systems:

-   `<b>`{=html}City Area Delivery Planner (Intra-City)`</b>`{=html} ---
    Uses the Greedy Nearest-Neighbour algorithm\
-   `<b>`{=html}Optimal Route Planner (Inter-City)`</b>`{=html} --- Uses
    the Exact Traveling Salesman Problem (TSP) algorithm

```{=html}
<hr>
```
```{=html}
<h2 style="font-size:32px;">
```
📦 Modules Overview
```{=html}
</h2>
```
```{=html}
<h3 style="font-size:28px;">
```
1.  City Area Delivery Planner (Intra-City)
    ```{=html}
    </h3>
    ```

An intra-city routing tool using the Greedy Nearest Neighbour algorithm
for fast, efficient path calculation across multiple delivery zones.

```{=html}
<h4 style="font-size:24px;">
```
Features
```{=html}
</h4>
```
-   Fast nearest-neighbour routing\
-   Interactive map of city areas\
-   Visual delivery sequence\
-   Instant computation even for many locations

```{=html}
<h4 style="font-size:24px;">
```
Algorithm Used -- Greedy Nearest Neighbour
```{=html}
</h4>
```
1.  `<b>`{=html}Start at the chosen location`</b>`{=html} -- Algorithm
    begins from the selected starting area.\
2.  `<b>`{=html}Select the closest unvisited area`</b>`{=html} --
    Computes distances & picks the nearest.\
3.  `<b>`{=html}Move and mark visited`</b>`{=html}\
4.  `<b>`{=html}Repeat until all areas visited`</b>`{=html}

```{=html}
<h4 style="font-size:24px;">
```
Performance
```{=html}
</h4>
```
-   `<b>`{=html}Time Complexity:`</b>`{=html} O(n²)\
-   Efficient for `<b>`{=html}50+ stops`</b>`{=html}\
-   Typically achieves `<b>`{=html}85% optimal accuracy`</b>`{=html}

```{=html}
<hr>
```
```{=html}
<h3 style="font-size:28px;">
```
2.  Optimal Route Planner (Inter-City)
    ```{=html}
    </h3>
    ```

A route optimization system using the Exact TSP algorithm for
mathematically shortest inter-city delivery paths.

```{=html}
<h4 style="font-size:24px;">
```
Features
```{=html}
</h4>
```
-   Fully optimal TSP route\
-   Interactive India map\
-   Start/end customization\
-   Delivery quantity selection

```{=html}
<h4 style="font-size:24px;">
```
Algorithm -- Exact TSP
```{=html}
</h4>
```
-   Computes `<b>`{=html}all permutations`</b>`{=html}\
-   Picks `<b>`{=html}shortest path`</b>`{=html}\
-   Optimal for `<b>`{=html}≤ 10 cities`</b>`{=html}

```{=html}
<h4 style="font-size:24px;">
```
Performance
```{=html}
</h4>
```
-   `<b>`{=html}Time Complexity:`</b>`{=html} O(n!)\
-   Best for high‑accuracy logistics planning

```{=html}
<hr>
```
```{=html}
<h2 style="font-size:32px;">
```
📁 Project Structure
```{=html}
</h2>
```
```{=html}
<pre>
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
</pre>
```
```{=html}
<hr>
```
```{=html}
<h2 style="font-size:32px;">
```
▶️ How to Use
```{=html}
</h2>
```
1.  Open the respective `<code>`{=html}index.html`</code>`{=html}\
2.  Select start & end location\
3.  Enter parcel quantities\
4.  Click relevant route button\
5.  View route, sequence & distance

```{=html}
<hr>
```
```{=html}
<h2 style="font-size:32px;">
```
📊 Feature Comparison
```{=html}
</h2>
```
```{=html}
<table>
```
```{=html}
<tr>
```
```{=html}
<th>
```
Feature
```{=html}
</th>
```
```{=html}
<th>
```
Intra-City (Greedy)
```{=html}
</th>
```
```{=html}
<th>
```
Inter-City (TSP Optimal)
```{=html}
</th>
```
```{=html}
</tr>
```
```{=html}
<tr>
```
```{=html}
<td>
```
Algorithm Type
```{=html}
</td>
```
```{=html}
<td>
```
Nearest Neighbour
```{=html}
</td>
```
```{=html}
<td>
```
Exact TSP
```{=html}
</td>
```
```{=html}
</tr>
```
```{=html}
<tr>
```
```{=html}
<td>
```
Speed
```{=html}
</td>
```
```{=html}
<td>
```
Very Fast
```{=html}
</td>
```
```{=html}
<td>
```
Slow (Factorial)
```{=html}
</td>
```
```{=html}
</tr>
```
```{=html}
<tr>
```
```{=html}
<td>
```
Accuracy
```{=html}
</td>
```
```{=html}
<td>
```
85--95%
```{=html}
</td>
```
```{=html}
<td>
```
100%
```{=html}
</td>
```
```{=html}
</tr>
```
```{=html}
<tr>
```
```{=html}
<td>
```
Scale
```{=html}
</td>
```
```{=html}
<td>
```
50+ areas
```{=html}
</td>
```
```{=html}
<td>
```
≤ 10 cities
```{=html}
</td>
```
```{=html}
</tr>
```
```{=html}
<tr>
```
```{=html}
<td>
```
Use Case
```{=html}
</td>
```
```{=html}
<td>
```
Quick delivery
```{=html}
</td>
```
```{=html}
<td>
```
Inter-city logistics
```{=html}
</td>
```
```{=html}
</tr>
```
```{=html}
</table>
```
```{=html}
<hr>
```
```{=html}
<h2 style="font-size:32px;">
```
👥 Contributors
```{=html}
</h2>
```
-   `<b>`{=html}Satyam Varu (B24EE1086)`</b>`{=html}\
-   `<b>`{=html}Arni Godiawala (B24EE1021)`</b>`{=html}\
-   `<b>`{=html}Maitry Gami (B24CS1041)`</b>`{=html}
