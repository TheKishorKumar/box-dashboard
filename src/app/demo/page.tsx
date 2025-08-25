"use client"

import { useState } from "react"
import { SelectInput } from "@/components/ui/select-input"
import { StockGroupSelect } from "@/components/ui/stock-group-select"
import { MeasuringUnitSelect } from "@/components/ui/measuring-unit-select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const demoOptions = [
  { id: 1, label: "Vegetables", description: "Fresh vegetables and produce" },
  { id: 2, label: "Meat", description: "Fresh meat and poultry products" },
  { id: 3, label: "Dairy", description: "Dairy products and milk-based items" },
  { id: 4, label: "Grains", description: "Rice, wheat, and grain products" },
  { id: 5, label: "Beverages", description: "Drinks and beverage products" },
]

const demoMeasuringUnits = [
  { id: 1, name: "Kilograms", abbreviation: "kg", createdAt: new Date().toISOString() },
  { id: 2, name: "Grams", abbreviation: "g", createdAt: new Date().toISOString() },
  { id: 3, name: "Liters", abbreviation: "L", createdAt: new Date().toISOString() },
  { id: 4, name: "Milliliters", abbreviation: "ml", createdAt: new Date().toISOString() },
  { id: 5, name: "Pieces", abbreviation: "pcs", createdAt: new Date().toISOString() },
]

const demoStockGroups = [
  { id: 1, name: "Vegetables", description: "Fresh vegetables and produce", itemCount: 0, createdAt: new Date().toISOString() },
  { id: 2, name: "Meat", description: "Fresh meat and poultry products", itemCount: 0, createdAt: new Date().toISOString() },
  { id: 3, name: "Dairy", description: "Dairy products and milk-based items", itemCount: 0, createdAt: new Date().toISOString() },
  { id: 4, name: "Grains", description: "Rice, wheat, and grain products", itemCount: 0, createdAt: new Date().toISOString() },
  { id: 5, name: "Beverages", description: "Drinks and beverage products", itemCount: 0, createdAt: new Date().toISOString() },
]

export default function DemoPage() {
  const [selectedValue1, setSelectedValue1] = useState("")
  const [selectedValue2, setSelectedValue2] = useState("")
  const [selectedValue3, setSelectedValue3] = useState("")
  const [selectedValue4, setSelectedValue4] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
                 <div>
           <h1 className="text-3xl font-bold text-gray-900 mb-2">SelectInput Component</h1>
           <p className="text-gray-600">Demonstrating the select-like variant with different configurations</p>
         </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Select-like Variant with Descriptions */}
           <Card>
             <CardHeader>
               <CardTitle>SelectInput with Descriptions</CardTitle>
               <CardDescription>Matches Radix UI Select styling with descriptions</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <SelectInput
                 value={selectedValue1}
                 onChange={setSelectedValue1}
                 placeholder="Select an option"
                 options={demoOptions}
                 showDescriptions={true}
               />
               <div className="text-sm text-gray-500">
                 Selected: {selectedValue1 || "None"}
               </div>
             </CardContent>
           </Card>

           {/* Select-like Variant without Descriptions */}
           <Card>
             <CardHeader>
               <CardTitle>SelectInput (No Descriptions)</CardTitle>
               <CardDescription>Clean select styling without secondary text</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <SelectInput
                 value={selectedValue2}
                 onChange={setSelectedValue2}
                 placeholder="Select an option"
                 options={demoOptions}
                 showDescriptions={false}
               />
               <div className="text-sm text-gray-500">
                 Selected: {selectedValue2 || "None"}
               </div>
             </CardContent>
           </Card>

                     {/* StockGroupSelect Component */}
           <Card>
             <CardHeader>
               <CardTitle>StockGroupSelect Component</CardTitle>
               <CardDescription>Specialized component for stock groups</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <StockGroupSelect
                 value={selectedValue3}
                 onChange={setSelectedValue3}
                 placeholder="Select a stock group"
                 stockGroups={demoStockGroups}
                 showDescriptions={true}
               />
               <div className="text-sm text-gray-500">
                 Selected: {selectedValue3 || "None"}
               </div>
             </CardContent>
           </Card>

           {/* MeasuringUnitSelect Component */}
           <Card>
             <CardHeader>
               <CardTitle>MeasuringUnitSelect Component</CardTitle>
               <CardDescription>Specialized component for measuring units</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <MeasuringUnitSelect
                 value={selectedValue4}
                 onChange={setSelectedValue4}
                 placeholder="Select a measuring unit"
                 measuringUnits={demoMeasuringUnits}
                 showDescriptions={true}
               />
               <div className="text-sm text-gray-500">
                 Selected: {selectedValue4 || "None"}
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>Code examples for different variants</CardDescription>
          </CardHeader>
                     <CardContent>
             <div className="space-y-4">
               <div>
                 <h4 className="font-medium mb-2">SelectInput with Descriptions</h4>
                 <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<SelectInput
  value={value}
  onChange={setValue}
  placeholder="Select an option"
  options={options}
  showDescriptions={true}
/>`}
                 </pre>
               </div>
               
               <div>
                 <h4 className="font-medium mb-2">SelectInput without Descriptions</h4>
                 <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<SelectInput
  value={value}
  onChange={setValue}
  placeholder="Select an option"
  options={options}
  showDescriptions={false}
/>`}
                 </pre>
               </div>
               
               <div>
                 <h4 className="font-medium mb-2">StockGroupSelect without Descriptions</h4>
                 <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<StockGroupSelect
  value={value}
  onChange={setValue}
  placeholder="Select a stock group"
  stockGroups={stockGroups}
  showDescriptions={false}
/>`}
                 </pre>
               </div>
             </div>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
