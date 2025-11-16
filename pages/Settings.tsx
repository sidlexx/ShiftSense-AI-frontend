import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { N8N_WEBHOOK_URL_KEY, MOCK_N8N_WEBHOOK_URL } from '../constants';

const Settings: React.FC = () => {
    const [webhookUrl, setWebhookUrl] = useState('');

    useEffect(() => {
        const storedUrl = localStorage.getItem(N8N_WEBHOOK_URL_KEY);
        setWebhookUrl(storedUrl || MOCK_N8N_WEBHOOK_URL);
    }, []);

    const handleSave = () => {
        try {
            // Basic URL validation
            new URL(webhookUrl);
            localStorage.setItem(N8N_WEBHOOK_URL_KEY, webhookUrl);
            toast.success("Settings saved successfully!");
        } catch (_) {
            toast.error("Invalid Webhook URL provided.");
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold font-heading">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>API Configuration</CardTitle>
                    <CardDescription>Configure the connection to your backend services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="n8n-webhook" className="block text-sm font-medium text-muted-foreground mb-1">
                                n8n Webhook URL
                            </label>
                            <input
                                id="n8n-webhook"
                                type="url"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                placeholder="https://your-n8n-instance.com/webhook/..."
                                className="w-full px-3 py-2 text-sm bg-transparent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                             <p className="text-xs text-muted-foreground mt-1">This is the POST endpoint for triggering employee analysis.</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSave}>Save Changes</Button>
                </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Risk Thresholds</CardTitle>
                    <CardDescription>Customize the score ranges for each risk level. (UI is for display only)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="font-medium">Critical</label>
                        <input type="text" value="70 - 100" disabled className="w-24 text-center bg-muted border border-border rounded-md py-1"/>
                    </div>
                     <div className="flex items-center justify-between">
                        <label className="font-medium">Warning</label>
                        <input type="text" value="40 - 69" disabled className="w-24 text-center bg-muted border border-border rounded-md py-1"/>
                    </div>
                     <div className="flex items-center justify-between">
                        <label className="font-medium">Monitor</label>
                        <input type="text" value="20 - 39" disabled className="w-24 text-center bg-muted border border-border rounded-md py-1"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;