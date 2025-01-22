'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { fetchBasicInfo, saveBasicInfo } from "@/services/api"; // Ensure these are defined in your API service
import AuthenticatedPage from "@/components/AuthenticatedPage";

type BasicInfo = {
    age: number;
    height: number;
    weight: number;
    ideal_weight: number;
    ideal_body_fat: number;
};

export default function ProfilePage() {
    const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [saving, setSaving] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const infoQuestions = [
        { key: "age", label: "What is your age?" },
        { key: "height", label: "What is your height (in cm)?" },
        { key: "weight", label: "What is your weight (in kg)?" },
        { key: "ideal_weight", label: "What is your ideal weight (in kg)?" },
        { key: "ideal_body_fat", label: "What is your ideal body fat percentage?" },
    ];

    const form = useForm<BasicInfo>({
        defaultValues: {
            age: 0,
            height: 0,
            weight: 0,
            ideal_weight: 0,
            ideal_body_fat: 0,
        },
        mode: "onChange",
    });

    useEffect(() => {
        const loadBasicInfo = async () => {
            try {
                const data = await fetchBasicInfo();
                if (data) {
                    setBasicInfo(data);
                }
            } catch (error) {
                console.error("Error fetching basic info:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBasicInfo();
    }, []);

    const handleNextStep = async () => {
        if (currentStep < infoQuestions.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setSaving(true);
            try {
                const basicInfoData = form.getValues();
                await saveBasicInfo(basicInfoData);
                setBasicInfo(basicInfoData);
            } catch (error) {
                console.error("Error saving basic info:", error);
                alert("Failed to save basic info.");
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) {
        return <p className="text-center mt-20 text-xl font-bold">Loading your profile...</p>;
    }

    return (
        <AuthenticatedPage>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                {basicInfo ? (
                    <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
                        <h1 className="text-2xl font-bold mb-4">Your Basic Information</h1>
                        <table className="table-auto w-full">
                            <tbody>
                                <tr>
                                    <td className="font-bold">Age</td>
                                    <td>{basicInfo.age}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Height</td>
                                    <td>{basicInfo.height} cm</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Weight</td>
                                    <td>{basicInfo.weight} kg</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Ideal Weight</td>
                                    <td>{basicInfo.ideal_weight} kg</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Ideal Body Fat</td>
                                    <td>{basicInfo.ideal_body_fat}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
                        <Form {...form}>
                            <FormField
                                name={infoQuestions[currentStep].key as keyof BasicInfo}
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{infoQuestions[currentStep].label}</FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                type="number"
                                                className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                onClick={handleNextStep}
                                className="w-full"
                                disabled={!form.formState.isValid || saving}
                            >
                                {currentStep < infoQuestions.length - 1 ? "Next" : "Save"}
                            </Button>
                        </Form>
                    </div>
                )}
            </div>
        </AuthenticatedPage>
    );
}
