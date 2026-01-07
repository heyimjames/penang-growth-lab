"use client"

const categories = {
  row1: [
    "Airlines",
    "Telecoms",
    "Energy Providers",
    "Banks",
    "Insurance",
    "Retailers",
    "Delivery Services",
    "Subscription Services",
    "Travel Agents",
    "Car Dealerships",
  ],
  row2: [
    "Broadband",
    "Hotels",
    "E-commerce",
    "Utilities",
    "Credit Cards",
    "Gyms",
    "Property Agents",
    "Train Companies",
    "Parking Companies",
    "Online Marketplaces",
  ],
}

export function CompanyTicker() {
  return (
    <div className="w-full overflow-hidden py-4 space-y-3">
      {/* Row 1 - scrolls left */}
      <div className="relative flex overflow-hidden">
        <div className="flex shrink-0 animate-ticker-left">
          {categories.row1.map((category, index) => (
            <span
              key={`row1a-${index}`}
              className="inline-flex items-center px-4 py-2 mx-2 text-sm font-medium text-forest-600 bg-forest-50 border border-forest-100 rounded-full whitespace-nowrap hover:bg-forest-100 hover:border-forest-200 transition-colors cursor-default"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 animate-ticker-left">
          {categories.row1.map((category, index) => (
            <span
              key={`row1b-${index}`}
              className="inline-flex items-center px-4 py-2 mx-2 text-sm font-medium text-forest-600 bg-forest-50 border border-forest-100 rounded-full whitespace-nowrap hover:bg-forest-100 hover:border-forest-200 transition-colors cursor-default"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 - scrolls right */}
      <div className="relative flex overflow-hidden">
        <div className="flex shrink-0 animate-ticker-right">
          {categories.row2.map((category, index) => (
            <span
              key={`row2a-${index}`}
              className="inline-flex items-center px-4 py-2 mx-2 text-sm font-medium text-forest-600 bg-forest-50 border border-forest-100 rounded-full whitespace-nowrap hover:bg-forest-100 hover:border-forest-200 transition-colors cursor-default"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 animate-ticker-right">
          {categories.row2.map((category, index) => (
            <span
              key={`row2b-${index}`}
              className="inline-flex items-center px-4 py-2 mx-2 text-sm font-medium text-forest-600 bg-forest-50 border border-forest-100 rounded-full whitespace-nowrap hover:bg-forest-100 hover:border-forest-200 transition-colors cursor-default"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
