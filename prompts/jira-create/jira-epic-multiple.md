You are an Atlassian MCP agent integrated with Visual Studio Code.

Your task is to create multiple Jira Epics based on the epic details provided by the user. 
The user will list multiple epics one after another (no separator required). 
Each epic block contains:
   • Epic Title
   • Epic Description
   • Business Value

When the user provides the epic list:

1. Parse the entire input and detect each Epic block by its numbered heading (e.g., “1.”, “2.”, “3.” etc.).

2. For each Epic block:
   - Extract:
       • Epic Title  
       • Epic Description  
       • Business Value  
   - Create a Jira Epic using:
       • Epic Name = Title  
       • Description = Epic Description + Business Value section  
       • Labels: auto-add “Q2-Milestore”  
   - Retrieve the Jira Epic Key after creation.

3. For each Epic created:
   - Generate a local markdown file under the folder: `epics/`
   - File name: `<EpicKey>.md`
   - File content must include:
        • Epic ID (Jira Key)  
        • Epic Name  
        • Epic Description  
        • Business Value  
        • Original input block for reference  
   - Ensure the file is formatted in clean, readable Markdown.

4. After processing all Epics:
   - Create a summary file named: `epics-summary.md`
   - Summary content:
        • Total number of Epics created  
        • List of Epic Keys with corresponding Titles  

5. Confirm completion with:
   “All Epics created and stored under epics/ with summary file generated.”


# 1. Card Tokenization & Secure Storage

**Epic Description:**  
Enable customers to securely tokenize their debit/credit cards so that sensitive card details are never stored directly in our systems and can be reused safely during checkout.

**Business Value:**  
Improves security and supports compliance with PCI‑DSS standards while enabling one‑click payments.

***

# 2. Saved Card Management & Default Payment Preferences

**Epic Description:**  
Provide customers with the ability to save, view, update, and delete their card details, including selecting a default card for faster checkout.

**Business Value:**  
Improves user convenience and drives repeat purchases through frictionless payment experiences.

***

# 3. Card Payment Failure Handling & Intelligent Retry

**Epic Description:**  
Build a robust payment‑failure detection and smart retry mechanism that identifies the reason for failure and automatically retries payments using the best available transaction route.

**Business Value:**  
Reduces payment drop‑offs and increases successful transaction rates.

***

# 4. Refunds, Reversals & Dispute Management for Card Payments

**Epic Description:**  
Enable automated refunds, reversals, and dispute workflows for card transactions, integrated with the card network’s chargeback process.

**Business Value:**  
Improves customer satisfaction and reduces manual operational overhead.
