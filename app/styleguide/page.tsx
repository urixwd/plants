"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import { PlantCard } from "@/components/plants/plant-card";

export default function StyleGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary-800">
          🌱 Plants App Styleguide
        </h1>
        <p className="text-xl text-earth-600">
          Component reference and design system
        </p>
      </div>

      {/* Colors */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">Colors</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-medium text-earth-800">
            Primary (Green)
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-primary-50 p-4 rounded text-center">
              <div className="text-sm font-medium">primary-50</div>
              <div className="text-xs text-gray-600">#f0fdf4</div>
            </div>
            <div className="bg-primary-200 p-4 rounded text-center">
              <div className="text-sm font-medium">primary-200</div>
              <div className="text-xs text-gray-600">#bbf7d0</div>
            </div>
            <div className="bg-primary-400 p-4 rounded text-center text-white">
              <div className="text-sm font-medium">primary-400</div>
              <div className="text-xs opacity-80">#4ade80</div>
            </div>
            <div className="bg-primary-600 p-4 rounded text-center text-white">
              <div className="text-sm font-medium">primary-600</div>
              <div className="text-xs opacity-80">#16a34a</div>
            </div>
            <div className="bg-primary-800 p-4 rounded text-center text-white">
              <div className="text-sm font-medium">primary-800</div>
              <div className="text-xs opacity-80">#166534</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium text-earth-800">Earth Tones</h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-earth-50 p-4 rounded text-center">
              <div className="text-sm font-medium">earth-50</div>
              <div className="text-xs text-gray-600">#faf5f0</div>
            </div>
            <div className="bg-earth-200 p-4 rounded text-center">
              <div className="text-sm font-medium">earth-200</div>
              <div className="text-xs text-gray-600">#e9d5c4</div>
            </div>
            <div className="bg-earth-400 p-4 rounded text-center text-white">
              <div className="text-sm font-medium">earth-400</div>
              <div className="text-xs opacity-80">#b8956b</div>
            </div>
            <div className="bg-earth-600 p-4 rounded text-center text-white">
              <div className="text-sm font-medium">earth-600</div>
              <div className="text-xs opacity-80">#8b6341</div>
            </div>
            <div className="bg-earth-800 p-4 rounded text-center text-white">
              <div className="text-sm font-medium">earth-800</div>
              <div className="text-xs opacity-80">#563d26</div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-primary-800 mb-2">
              Heading 1 - Main Title
            </h1>
            <p className="text-sm text-earth-600">
              text-4xl font-bold text-primary-800
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-primary-700 mb-2">
              Heading 2 - Section Title
            </h2>
            <p className="text-sm text-earth-600">
              text-3xl font-semibold text-primary-700
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-primary-700 mb-2">
              Heading 3 - Card Title
            </h3>
            <p className="text-sm text-earth-600">
              text-2xl font-semibold text-primary-700
            </p>
          </div>
          <div>
            <p className="text-xl text-earth-600 mb-2">
              Subtitle - Large descriptive text
            </p>
            <p className="text-sm text-earth-600">text-xl text-earth-600</p>
          </div>
          <div>
            <p className="text-base text-earth-700 mb-2">
              Body Text - Regular paragraph content
            </p>
            <p className="text-sm text-earth-600">text-base text-earth-700</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">Buttons</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Button>Primary Button</Button>
            <p className="text-xs text-earth-600">variant="default"</p>
          </div>
          <div className="space-y-2">
            <Button variant="secondary">Secondary Button</Button>
            <p className="text-xs text-earth-600">variant="secondary"</p>
          </div>
          <div className="space-y-2">
            <Button variant="outline">Outline Button</Button>
            <p className="text-xs text-earth-600">variant="outline"</p>
          </div>
          <div className="space-y-2">
            <Button variant="ghost">Ghost Button</Button>
            <p className="text-xs text-earth-600">variant="ghost"</p>
          </div>
          <div className="space-y-2">
            <Button variant="link">Link Button</Button>
            <p className="text-xs text-earth-600">variant="link"</p>
          </div>
          <div className="space-y-2">
            <Button variant="destructive">Delete Button</Button>
            <p className="text-xs text-earth-600">variant="destructive"</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium text-earth-800">Button Sizes</h3>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Button size="sm">Small</Button>
              <p className="text-xs text-earth-600">size="sm"</p>
            </div>
            <div className="space-y-2">
              <Button>Default</Button>
              <p className="text-xs text-earth-600">size="default"</p>
            </div>
            <div className="space-y-2">
              <Button size="lg">Large</Button>
              <p className="text-xs text-earth-600">size="lg"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">Cards</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
              <CardDescription>
                Simple card with header and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-earth-700">
                This is the card content area. Use this for displaying
                information about plants, care events, or other data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
              <CardDescription>
                Card with action buttons in footer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-earth-700">
                This card includes footer actions like buttons or links.
              </p>
            </CardContent>
            <CardFooter className="space-x-2">
              <Button size="sm">Primary Action</Button>
              <Button variant="outline" size="sm">
                Secondary
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium text-earth-800">
            Plant Card Example
          </h3>
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🌿</span>
                <span>Monstera Deliciosa</span>
              </CardTitle>
              <CardDescription>Living Room • Healthy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-earth-600">Last watered:</span>
                  <span className="font-medium">3 days ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-earth-600">Next care:</span>
                  <span className="font-medium text-primary-600">
                    Water tomorrow
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="space-x-2">
              <Button size="sm" variant="outline">
                💧 Water
              </Button>
              <Button size="sm" variant="ghost">
                📷 Photo
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">
          Form Elements
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-earth-800">Input Fields</h3>
            <div className="space-y-2">
              <Input placeholder="Enter plant name..." />
              <Input type="email" placeholder="your@email.com" />
              <Input type="date" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-earth-800">
              Select Dropdown
            </h3>
            <Select>
              <option>Choose location...</option>
              <option>Living Room</option>
              <option>Kitchen</option>
              <option>Bedroom</option>
            </Select>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Healthy</Badge>
          <Badge variant="warning">Struggling</Badge>
          <Badge variant="destructive">Sick</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      {/* Avatars */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">Avatars</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="text-center space-y-2">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=100&h=100&fit=crop&crop=center" alt="Plant photo" />
                <AvatarFallback>🌿</AvatarFallback>
              </Avatar>
              <p className="text-xs text-earth-600">With image</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar>
                <AvatarFallback>🌱</AvatarFallback>
              </Avatar>
              <p className="text-xs text-earth-600">Emoji fallback</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar>
                <AvatarFallback>🪴</AvatarFallback>
              </Avatar>
              <p className="text-xs text-earth-600">Emoji fallback</p>
            </div>
          </div>
          <p className="text-sm text-earth-600">
            Plant cards now show main photos in avatars when available, with emoji fallbacks.
          </p>
        </div>
      </section>

      {/* Plant Card Example */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">
          Plant Components
        </h2>
        <div className="max-w-sm">
          <PlantCard
            plantInstance={{
              id: "demo-plant",
              idAuto: 1,
              plantId: "demo",
              nickname: "My Monstera",
              location: "living room",
              potSize: "m",
              sunType: "indirect",
              sunStrength: 3,
              healthStatus: "healthy",
              isActive: true,
              notes: "Doing great in the living room!",
              createdAt: new Date(),
              updatedAt: new Date(),
              acquisitionDate: null,
              acquisitionSource: null,
              plant: {
                id: "demo",
                idAuto: 1,
                scientificName: "Monstera deliciosa",
                englishName: "Swiss Cheese Plant",
                spanishName: null,
                hebrewName: null,
                recommendedLight: "bright indirect",
                recommendedSoil: null,
                recommendedSoilAiriness: null,
                recommendedSoilPh: null,
                recommendedSoilMoisture: null,
                recommendedWatering: null,
                recommendedWaterAmount: null,
                recommendedFertilizer: null,
                recommendedFlowering: null,
                notes: null,
                careDifficulty: "easy",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            }}
            onQuickWater={() => alert("Quick water!")}
            onViewDetails={() => alert("View details!")}
          />
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-primary-700">
          Usage Examples
        </h2>
        <div className="bg-earth-50 p-6 rounded-lg">
          <h3 className="text-xl font-medium text-earth-800 mb-4">
            Component Import Examples
          </h3>
          <div className="space-y-2 font-mono text-sm bg-white p-4 rounded border">
            <div>{"import { Button } from '@/components/ui/button'"}</div>
            <div>
              {
                "import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'"
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
