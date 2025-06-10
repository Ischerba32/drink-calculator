"use client"

import type React from "react"
import { useState, useMemo } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Button,
  Paper,
  Tooltip,
  Divider,
  type SelectChangeEvent,
} from "@mui/material"
import { LocalCafe, AcUnit, LocalDrink, Opacity, Waves, ShoppingCart } from "@mui/icons-material"

// Data structures
interface BaseOption {
  id: string
  name: string
  icon: React.ReactNode
  price: number
  calories: number
  color: string
}

interface FlavorSyrup {
  id: string
  name: string
  category: "fruit" | "dessert" | "seasonal"
  price: number
  calories: number
  color: string
}

interface PowderAddon {
  id: string
  name: string
  price: number
  calories: number
  description: string
  color: string
}

// Sample data
const baseOptions: BaseOption[] = [
  { id: "hot-coffee", name: "Hot Coffee", icon: <LocalCafe />, price: 3.5, calories: 5, color: "#8B4513" },
  { id: "iced-coffee", name: "Iced Coffee", icon: <AcUnit />, price: 3.75, calories: 5, color: "#A0522D" },
  { id: "milk", name: "Milk", icon: <LocalDrink />, price: 2.5, calories: 150, color: "#FFFDD0" },
  { id: "water", name: "Water", icon: <Opacity />, price: 1.0, calories: 0, color: "#87CEEB" },
  { id: "carbonated", name: "Carbonated Water", icon: <Waves />, price: 1.25, calories: 0, color: "#B0E0E6" },
]

const flavorSyrups: FlavorSyrup[] = [
  // Fruit
  { id: "strawberry", name: "Strawberry", category: "fruit", price: 0.75, calories: 60, color: "#FF69B4" },
  { id: "blueberry", name: "Blueberry", category: "fruit", price: 0.75, calories: 55, color: "#4169E1" },
  { id: "raspberry", name: "Raspberry", category: "fruit", price: 0.75, calories: 58, color: "#DC143C" },
  { id: "mango", name: "Mango", category: "fruit", price: 0.8, calories: 65, color: "#FFD700" },
  { id: "peach", name: "Peach", category: "fruit", price: 0.75, calories: 62, color: "#FFCBA4" },
  { id: "cherry", name: "Cherry", category: "fruit", price: 0.75, calories: 60, color: "#DE3163" },
  { id: "orange", name: "Orange", category: "fruit", price: 0.7, calories: 58, color: "#FFA500" },
  { id: "lemon", name: "Lemon", category: "fruit", price: 0.7, calories: 55, color: "#FFFF00" },
  { id: "lime", name: "Lime", category: "fruit", price: 0.7, calories: 55, color: "#32CD32" },
  { id: "coconut", name: "Coconut", category: "fruit", price: 0.85, calories: 70, color: "#F5F5DC" },

  // Dessert
  { id: "vanilla", name: "Vanilla", category: "dessert", price: 0.65, calories: 65, color: "#F5DEB3" },
  { id: "chocolate", name: "Chocolate", category: "dessert", price: 0.7, calories: 75, color: "#D2691E" },
  { id: "caramel", name: "Caramel", category: "dessert", price: 0.75, calories: 80, color: "#D2B48C" },
  { id: "hazelnut", name: "Hazelnut", category: "dessert", price: 0.8, calories: 70, color: "#D2691E" },
  { id: "cookies-cream", name: "Cookies & Cream", category: "dessert", price: 0.85, calories: 85, color: "#F5F5F5" },
  { id: "salted-caramel", name: "Salted Caramel", category: "dessert", price: 0.85, calories: 82, color: "#CD853F" },
  { id: "white-chocolate", name: "White Chocolate", category: "dessert", price: 0.8, calories: 78, color: "#FFFACD" },
  { id: "peanut-butter", name: "Peanut Butter", category: "dessert", price: 0.85, calories: 90, color: "#DEB887" },
  { id: "tiramisu", name: "Tiramisu", category: "dessert", price: 0.9, calories: 88, color: "#F4A460" },
  { id: "cheesecake", name: "Cheesecake", category: "dessert", price: 0.85, calories: 85, color: "#FFFACD" },

  // Seasonal
  { id: "pumpkin-spice", name: "Pumpkin Spice", category: "seasonal", price: 0.9, calories: 75, color: "#FF7518" },
  { id: "cinnamon", name: "Cinnamon", category: "seasonal", price: 0.75, calories: 65, color: "#D2691E" },
  { id: "gingerbread", name: "Gingerbread", category: "seasonal", price: 0.85, calories: 80, color: "#B87333" },
  { id: "eggnog", name: "Eggnog", category: "seasonal", price: 0.9, calories: 95, color: "#F5DEB3" },
  { id: "peppermint", name: "Peppermint", category: "seasonal", price: 0.8, calories: 60, color: "#98FB98" },
  { id: "apple-cinnamon", name: "Apple Cinnamon", category: "seasonal", price: 0.85, calories: 70, color: "#CD853F" },
  { id: "maple", name: "Maple", category: "seasonal", price: 0.85, calories: 85, color: "#D2691E" },
  { id: "cranberry", name: "Cranberry", category: "seasonal", price: 0.8, calories: 65, color: "#DC143C" },
  { id: "lavender", name: "Lavender", category: "seasonal", price: 0.9, calories: 55, color: "#E6E6FA" },
  { id: "rose", name: "Rose", category: "seasonal", price: 0.95, calories: 58, color: "#FFB6C1" },
]

const powderAddons: PowderAddon[] = [
  { id: "collagen", name: "Collagen", price: 1.5, calories: 35, description: "Skin & joint health", color: "#FFF8DC" },
  { id: "bcaa", name: "BCAA", price: 1.25, calories: 10, description: "Muscle recovery", color: "#87CEEB" },
  { id: "creatine", name: "Creatine", price: 1.0, calories: 0, description: "Performance boost", color: "#F0F8FF" },
  { id: "matcha", name: "Matcha", price: 1.75, calories: 25, description: "Antioxidant power", color: "#9ACD32" },
  { id: "greens", name: "Greens", price: 2.0, calories: 30, description: "Superfood blend", color: "#228B22" },
  { id: "mct", name: "MCT Oil", price: 1.5, calories: 120, description: "Healthy fats", color: "#FFFACD" },
]

const SmartDrinksCalculator: React.FC = () => {
  const [selectedBase, setSelectedBase] = useState<string>("")
  const [selectedSyrup, setSelectedSyrup] = useState<string>("")
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [sweetness, setSweetness] = useState<number>(2)

  const selectedBaseOption = baseOptions.find((base) => base.id === selectedBase)
  const selectedSyrupOption = flavorSyrups.find((syrup) => syrup.id === selectedSyrup)
  const selectedAddonOptions = powderAddons.filter((addon) => selectedAddons.includes(addon.id))

  const { totalPrice, totalCalories } = useMemo(() => {
    let price = 0
    let calories = 0

    if (selectedBaseOption) {
      price += selectedBaseOption.price
      calories += selectedBaseOption.calories
    }

    if (selectedSyrupOption) {
      price += selectedSyrupOption.price
      calories += selectedSyrupOption.calories
    }

    selectedAddonOptions.forEach((addon) => {
      price += addon.price
      calories += addon.calories
    })

    // Sweetness adds calories (4g per tick = ~16 calories)
    calories += sweetness * 16

    return { totalPrice: price, totalCalories: calories }
  }, [selectedBaseOption, selectedSyrupOption, selectedAddonOptions, sweetness])

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]))
  }

  const getCupLayers = () => {
    const layers = []

    if (selectedBaseOption) {
      layers.push({ color: selectedBaseOption.color, height: 40, name: selectedBaseOption.name })
    }

    if (selectedSyrupOption) {
      layers.push({ color: selectedSyrupOption.color, height: 20, name: selectedSyrupOption.name })
    }

    selectedAddonOptions.forEach((addon) => {
      layers.push({ color: addon.color, height: 10, name: addon.name })
    })

    return layers
  }

  const handleAddToCart = () => {
    const orderData = {
      base: selectedBaseOption,
      syrup: selectedSyrupOption,
      addons: selectedAddonOptions,
      sweetness,
      totalPrice,
      totalCalories,
      timestamp: new Date().toISOString(),
    }

    // Post to /score endpoint or add to local basket
    console.log("Adding to cart:", orderData)

    // For demo purposes, we'll just show an alert
    alert(`Added to cart! Total: $${totalPrice.toFixed(2)}`)
  }

  return (
    <Box sx={{ maxWidth: 1250, mx: "auto", p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Smart Drinks Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Left Panel - Selectors */}
        <Grid item xs={12} md={8}>
          {/* Base Selector */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Choose Your Base
              </Typography>
              <Grid container spacing={2}>
                {baseOptions.map((base) => (
                  <Grid item xs={6} sm={4} md={2} key={base.id}>
                    <Paper
                      elevation={selectedBase === base.id ? 8 : 2}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        border: selectedBase === base.id ? 2 : 0,
                        borderColor: "primary.main",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => setSelectedBase(base.id)}
                    >
                      <Box sx={{ color: base.color, mb: 1 }}>{base.icon}</Box>
                      <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                        {base.name}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
                        ${base.price.toFixed(2)}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Flavor Syrup Dropdown */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <FormControl fullWidth>
                <InputLabel>Flavor Syrup (Optional)</InputLabel>
                <Select
                  value={selectedSyrup}
                  label="Flavor Syrup (Optional)"
                  onChange={(event: SelectChangeEvent<string>) => {
                    const value = event.target.value
                    console.log("Selected syrup:", value)
                    console.log("Event:", event)
                    setSelectedSyrup(value)
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {/* Fruit Syrups */}
                  {flavorSyrups
                    .filter((syrup) => syrup.category === "fruit")
                    .map((syrup) => (
                      <MenuItem key={syrup.id} value={syrup.id}>
                        {syrup.name} (+${syrup.price.toFixed(2)})
                      </MenuItem>
                    ))}

                  {/* Dessert Syrups */}
                  {flavorSyrups
                    .filter((syrup) => syrup.category === "dessert")
                    .map((syrup) => (
                      <MenuItem key={syrup.id} value={syrup.id}>
                        {syrup.name} (+${syrup.price.toFixed(2)})
                      </MenuItem>
                    ))}

                  {/* Seasonal Syrups */}
                  {flavorSyrups
                    .filter((syrup) => syrup.category === "seasonal")
                    .map((syrup) => (
                      <MenuItem key={syrup.id} value={syrup.id}>
                        {syrup.name} (+${syrup.price.toFixed(2)})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Powder Add-Ons */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Powder Add-Ons
              </Typography>
              <Grid container spacing={2}>
                {powderAddons.map((addon) => (
                  <Grid item xs={12} sm={6} md={4} key={addon.id}>
                    <Paper
                      elevation={selectedAddons.includes(addon.id) ? 6 : 2}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        border: selectedAddons.includes(addon.id) ? 2 : 0,
                        borderColor: "primary.main",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => handleAddonToggle(addon.id)}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="subtitle2">{addon.name}</Typography>
                        <Chip
                          label={`+$${addon.price.toFixed(2)}`}
                          size="small"
                          color={selectedAddons.includes(addon.id) ? "primary" : "default"}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                        {addon.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Sweetness Slider */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sweetness Level
              </Typography>
              <Box sx={{ px: 2 }}>
                <Tooltip title={`${sweetness * 4}g of sweetener`} placement="top">
                  <Slider
                    value={sweetness}
                    onChange={(_, value) => setSweetness(value as number)}
                    min={0}
                    max={4}
                    marks
                    step={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value * 4}g`}
                  />
                </Tooltip>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    No Sugar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Extra Sweet
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Preview & Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              {/* Cup Preview */}
              <Typography variant="h6" gutterBottom align="center">
                Live Preview
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 160,
                    border: "3px solid #333",
                    borderRadius: "0 0 60px 60px",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {getCupLayers().map((layer, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${layer.height}px`,
                        backgroundColor: layer.color,
                        transform: `translateY(-${getCupLayers()
                          .slice(0, index)
                          .reduce((sum, l) => sum + l.height, 0)}px)`,
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Summary */}
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              {selectedBaseOption && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">{selectedBaseOption.name}</Typography>
                  <Typography variant="body2">${selectedBaseOption.price.toFixed(2)}</Typography>
                </Box>
              )}

              {selectedSyrupOption && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">{selectedSyrupOption.name} Syrup</Typography>
                  <Typography variant="body2">${selectedSyrupOption.price.toFixed(2)}</Typography>
                </Box>
              )}

              {selectedAddonOptions.map((addon) => (
                <Box key={addon.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">{addon.name}</Typography>
                  <Typography variant="body2">${addon.price.toFixed(2)}</Typography>
                </Box>
              ))}

              {sweetness > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Sweetener ({sweetness * 4}g)</Typography>
                  <Typography variant="body2">Free</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Calories: {totalCalories}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!selectedBase}
                sx={{ mt: 2 }}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SmartDrinksCalculator
