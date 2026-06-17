# n8n-nodes-google-hotels-api

An [n8n](https://n8n.io/) community node that searches Google Hotels and returns structured property listings: name, nightly rate, total rate, rating, amenities, and coordinates. It is backed by the [Google Hotels API](https://apify.com/johnvc/google-hotels-search-scraper?fpr=9n7kx3) on [Apify](https://apify.com?fpr=9n7kx3) and bills per result, so there are no subscriptions and no minimums.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Output](#output) · [Example workflows](#example-workflows) · [Pricing](#pricing) · [Resources](#resources)

## What it does

Give the node a destination and dates, and it returns one item per property with the name, type, nightly and total rates, guest rating, review count, location, and amenities. It also works as an **AI Agent tool**, so an agent can look up places to stay on demand.

- Search hotels and vacation rentals by query and stay dates
- Filter by minimum and maximum nightly price
- Localize with currency, country, and language codes
- Choose how much data to return per property: Simplified, Raw, or Selected Fields

## Installation

Follow the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-google-hotels-api` as the npm package name.
4. Agree to the risks of using community nodes, then select **Install**.

After it installs, the **Google Hotels** node appears in the nodes panel.

> n8n Cloud only allows verified community nodes. Until this node is verified, install it on a self-hosted n8n instance.

## Credentials

You need a free [Apify account](https://apify.com?fpr=9n7kx3) and an API token.

1. Sign in to the [Apify Console](https://console.apify.com?fpr=9n7kx3).
2. Open **Settings > Integrations** and copy your **Personal API token**.
3. In n8n, create a new **Apify API** credential and paste the token.
4. Use the credential's **Test** button to confirm it works.

The node also supports **Apify OAuth2** if you prefer to connect that way.

## Operations

**Hotel > Search** returns properties that match a query and dates.

| Parameter | Description |
| --- | --- |
| Search Query | Destination or query to search for. Required. |
| Check-In Date / Check-Out Date | Stay dates, `YYYY-MM-DD`. |
| Adults / Children | Guest counts. |
| Currency | Three-letter currency code. |
| Country Code / Language Code | Localization, for example `us` and `en`. |
| Minimum Price / Maximum Price | Nightly rate bounds. `0` for no limit. |
| Maximum Pages | How many result pages to fetch. |
| Output | How much data to return: Simplified, Raw, or Selected Fields. |

## Output

Each property is returned as its own n8n item. The API returns nested fields per property, so the **Output** parameter lets you choose how much to return:

- **Simplified** (default): a compact object with `name`, `type`, `ratePerNight`, `totalRate`, `overallRating`, `reviews`, `locationRating`, `latitude`, `longitude`, and `propertyToken`. This mode is also used automatically when the node runs as an AI Agent tool, to keep responses small.
- **Raw**: every field the API returns for each property, using the original field names below.
- **Selected Fields**: pick exactly which fields to include.

### Fields (Raw and Selected Fields)

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Property name |
| `type` | string | Property type, for example `hotel` or `vacation rental` |
| `property_token` | string | Token used to fetch property details |
| `gps_coordinates` | object | Latitude and longitude |
| `check_in_time` | string | Check-in time |
| `check_out_time` | string | Check-out time |
| `rate_per_night` | object | Nightly rate, with and without taxes and fees |
| `total_rate` | object | Total rate for the stay |
| `prices` | array | Rates by source |
| `nearby_places` | array | Notable places nearby |
| `images` | array | Property image URLs |
| `overall_rating` | number | Overall guest rating |
| `reviews` | integer | Number of reviews |
| `location_rating` | number | Location rating |
| `amenities` | array | Available amenities |
| `excluded_amenities` | array | Amenities not available |
| `essential_info` | array | Short highlights about the property |

## Example workflows

### 1. Compare hotel rates for a trip

1. **Manual Trigger**.
2. **Google Hotels**: Search Query your destination, Check-In and Check-Out dates, Output `Simplified`.
3. **Sort**: by `ratePerNight` ascending to find the cheapest options.

### 2. Daily price watch for a destination

1. **Schedule Trigger**: run once a day.
2. **Google Hotels**: your destination and dates, Maximum Price set to your budget.
3. **IF** / **Slack**: alert when a highly rated property drops below your target.

### 3. Let an AI Agent recommend places to stay

1. **AI Agent** node.
2. Attach **Google Hotels** as a tool.
3. Ask "Find a 4-star hotel in Austin under $200 for next weekend." The agent calls the node (in Simplified mode) and answers with live options.

## Pricing

This node calls the [Google Hotels API](https://apify.com/johnvc/google-hotels-search-scraper?fpr=9n7kx3) on Apify, which is billed **pay-per-result**: a small per-search fee (about **$0.04 per page** of results) plus a fraction of a cent per property returned, with no subscription and no minimums. Apify also includes a free monthly usage tier that covers typical volumes. See the [Actor page](https://apify.com/johnvc/google-hotels-search-scraper?fpr=9n7kx3) for current rates.

## Resources

- [Google Hotels API on Apify](https://apify.com/johnvc/google-hotels-search-scraper?fpr=9n7kx3)
- [npm package](https://www.npmjs.com/package/n8n-nodes-google-hotels-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify n8n integration guide](https://docs.apify.com/platform/integrations/n8n)

## License

[MIT](LICENSE.md)
