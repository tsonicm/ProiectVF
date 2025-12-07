<span style="color:#4CAF50;">Prompt Files Documentation</span>
<div align="center">
<strong>This folder contains the prompt definitions used to query a Large Language Model (LLM) for identifying software verification tools.</strong>
The prompts define how the model searches, filters, and formats results into CSV for backend ingestion.
</div> <br>

<span style="color:#00A8E8;">Files Overview</span>
prompts/
│
├─ prompt_dynamic.txt
└─ prompt_simple.txt

<span style="color:#FF9800;">prompt_simple.txt</span>
<div style="border-left: 4px solid #FF9800; padding: 10px 15px; background:#FFF3E0;"> This file contains a fixed, unchanging prompt that defines the baseline instructions given to the LLM. </div>

<h3>Purpose</h3>
<ul>
  <li>Provides a stable and consistent set of instructions.</li>
  <li>Specifies the verification tool categories:</li>
  <li>Functional correctness</li>
  <li>Termination analysis</li>
  <li>Complexity bound analysis</li>
  <li>Neural network verification</li>
  <li>QBF solvers and evaluators</li>
  <li>Enforces strict CSV output formatting.</li>
  <li>Requires complete fields, escaped commas, and relevance scoring.</li>
</ul>

<h3>When It Should Be Used</h3>
<ul>
  <li>When predictable, reproducible behavior is needed.</li>
  <li>When benchmarking or testing LLM behavior.</li>
  <li>As a reference prompt that does not depend on external parameters.</li>
</ul>

<h3>What It Does Not Include</h3>
<ul>
  <li>No date insertion.</li>
  <li>No dynamic tool limits.</li>
  <li>No filtering based on recency or user settings.</li>
</ul>

<span style="color:#2196F3;">prompt_dynamic.txt</span>
<div style="border-left: 4px solid #2196F3; padding: 10px 15px; background:#E3F2FD;"> This file is a template prompt containing placeholders that are replaced at runtime by the backend or automation system. </div>

<h3>Contains Dynamic Placeholders</h3>
<ul>
  <li>{{date}}</li>
  <li>{{max_tools}}</li>
  <li>{{include_old_tools}}</li>
</ul>

<h3>What This Template Enables</h3>
<ul>
  <li>Date-aware queries.</li>
  <li>Adjustable limits on how many tools are returned.</li>
  <li>Optional filtering of outdated or unmaintained tools.</li>
</ul>

<h3>Typical Use Cases</h3>
<ul>
  <li>Backend services that allow users to control query parameters.</li>
  <li>Automated workflows requiring time-sensitive prompts.</li>
</ul>

<span style="color:#8E24AA;">Summary Table</span>
<table> 
  <tr> 
    <th style="text-align:left;">File</th> 
    <th style="text-align:left;">Type</th> 
    <th style="text-align:left;">Purpose</th> 
  </tr> 
  <tr> 
    <td>prompt_simple.txt</td> 
    <td>Fixed Prompt</td> 
    <td>Defines the core, unchanging instructions for the LLM.</td> 
  </tr> 
  <tr> 
    <td>prompt_dynamic.txt</td> 
    <td>Template Prompt</td> 
    <td>Injects runtime values such as dates and query limits for dynamic behavior.</td> 
  </tr> 
</table>
