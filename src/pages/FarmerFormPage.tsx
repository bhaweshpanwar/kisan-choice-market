
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";

const farmerSchema = z.object({
  farmSize: z.string().min(1, "Farm size is required"),
  location: z.string().min(3, "Location is required"),
  crops: z.string().min(3, "Please list at least one crop"),
  experience: z.string().min(1, "Years of experience is required"),
});

type FarmerFormValues = z.infer<typeof farmerSchema>;

export default function FarmerFormPage() {
  const { user, updateFarmerDetails } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerSchema),
    defaultValues: {
      farmSize: "",
      location: "",
      crops: "",
      experience: "",
    },
  });

  function onSubmit(values: FarmerFormValues) {
    setIsSubmitting(true);
    try {
      // Convert comma-separated crops to array
      const cropsArray = values.crops.split(",").map(crop => crop.trim());
      
      updateFarmerDetails({
        farmSize: values.farmSize,
        location: values.location,
        crops: cropsArray,
        experience: values.experience
      });
      
      toast.success("Farmer profile created successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create farmer profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto flex flex-col items-center justify-center py-12 px-4 md:px-6">
        <div className="w-full max-w-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-kisan-primary">Complete Your Farmer Profile</h1>
            <p className="text-muted-foreground">
              Tell us more about your farm to help connect you with buyers
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="farmSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Size (in acres/hectares)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5 acres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pune, Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="crops"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crops You Grow</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Rice, Wheat, Sugarcane (separate with commas)" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Farming Experience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full bg-kisan-accent hover:bg-kisan-accent/90 text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Profile..." : "Complete Profile"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
