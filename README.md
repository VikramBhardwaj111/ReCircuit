# ReCircuit

ReCircuit is a website for people who have old electronics and want to know what they can recycle and how to hand it over. Visitors can look up a device, follow a short preparation checklist, and request a pickup by email.

We built ReCircuit as a team web development project using HTML, CSS, and JavaScript. The site works on desktop and mobile, and each page focuses on a specific step in the collection process.

[Visit the live ReCircuit website](https://re-circuit-pied.vercel.app/)

## What you can do on the site

### Check which electronics are accepted

The Accepted Items page lists six categories, including computers, phones, batteries, monitors, accessories, and small appliances. You can filter by group or search for a specific item such as a laptop or charger. Each card includes handling tips and a link that opens the pickup form with that category already selected.

### Prepare devices for drop-off

The Drop-Off Guide has a five-step checklist covering tasks such as backing up files, removing SIM cards, and bundling cables. The progress bar updates as you check items off, and your browser saves your progress between visits. The page also has a searchable list of example collection centers.

### Request a pickup

Enter your contact details, pickup address, device category, item count, and preferred date and time. The site puts those details into a prefilled email draft. Review the draft and click **Send** in your email app. The coordinator can then reply to confirm a pickup time.

### Contact the team

The Contact page lists the team's email addresses and includes a form for preparing a general inquiry. You can also copy the primary contact address directly from the page.

## Run the project locally

Clone the repository with Git:

```bash
git clone https://github.com/VikramBhardwaj111/ReCircuit.git
```

You can also use **Code → Download ZIP** on GitHub and extract the folder. Open `index.html` in your browser to start. Keep the `images/` folder beside the HTML files so the photos load.

## Project files

| File or folder | What it contains |
| --- | --- |
| `index.html` | Homepage and links to the main collection steps |
| `categories.html` | Accepted electronics and category filters |
| `schedule.html` | Pickup request form |
| `dropoff.html` | Preparation checklist and example collection centers |
| `contact.html` | Team contact details and inquiry form |
| `style.css` | Colors, typography, page layouts, and mobile styles |
| `script.js` | Menu controls, search filters, checklist progress, and email drafts |
| `images/` | Photos used across the website |

## Project team

- Bhavini Raghuram Reddy
- Naman Dhawan
- Vikram Bhardwaj
