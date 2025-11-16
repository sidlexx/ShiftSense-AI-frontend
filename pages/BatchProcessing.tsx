import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { EmployeeMetrics } from '../types';
import toast from 'react-hot-toast';

type CsvRow = { [key: string]: string };

const BatchProcessing: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<CsvRow[]>([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const uploadedFile = event.target.files[0];
            setFile(uploadedFile);
            setResults(null);
            setData([]);
            setProgress(0);
            
            Papa.parse(uploadedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    setData(result.data as CsvRow[]);
                    toast.success(`${result.data.length} records loaded from ${uploadedFile.name}`);
                },
                error: (error) => {
                    toast.error(`CSV parsing error: ${error.message}`);
                }
            });
        }
    };
    
    const handleProcess = async () => {
        if (data.length === 0) {
            toast.error("No data to process.");
            return;
        }
        setProcessing(true);
        setResults(null);
        let successCount = 0;
        let failedCount = 0;

        for (let i = 0; i < data.length; i++) {
            // Here you would normally call your API for each row
            // We'll simulate it with a timeout
            await new Promise(resolve => setTimeout(resolve, 50)); 
            
            // Simple validation simulation
            if (data[i].employee_name && data[i].adherence_pct) {
                successCount++;
            } else {
                failedCount++;
            }
            setProgress(((i + 1) / data.length) * 100);
        }

        setResults({ success: successCount, failed: failedCount });
        setProcessing(false);
        toast.success("Batch processing complete!");
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading">Batch Processing</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Bulk Employee Analysis</CardTitle>
                    <CardDescription>Upload a CSV file to analyze multiple employees at once.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label htmlFor="csv-upload" className="w-full flex flex-col items-center px-4 py-10 bg-background text-primary rounded-lg shadow-sm tracking-wide border-2 border-dashed border-border cursor-pointer hover:bg-muted hover:border-primary">
                            <Upload className="w-10 h-10" />
                            <span className="mt-2 text-base leading-normal">{file ? file.name : 'Select a CSV file'}</span>
                            <input id="csv-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                        </label>
                    </div>

                    {data.length > 0 && !processing && !results && (
                        <div className="text-center">
                            <p className="text-lg font-semibold">{data.length} records ready for processing.</p>
                            <Button onClick={handleProcess} className="mt-4" size="lg">
                                Process All
                            </Button>
                        </div>
                    )}
                    
                    {processing && (
                        <div>
                           <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-primary">Processing...</span>
                                <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}

                    {results && (
                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle>Processing Results</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-around text-center">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-8 w-8 text-good" />
                                    <div>
                                        <p className="text-2xl font-bold">{results.success}</p>
                                        <p className="text-sm text-muted-foreground">Successful</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <XCircle className="h-8 w-8 text-critical" />
                                    <div>
                                        <p className="text-2xl font-bold">{results.failed}</p>
                                        <p className="text-sm text-muted-foreground">Failed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BatchProcessing;