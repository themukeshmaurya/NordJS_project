import { Request, Response } from 'express';
import shortid from 'shortid';
//import URL from '../models/url';
const URL: any = require('../models/url');

async function shortUrl(req: Request, res: Response) {
    try {
        const body = req.body;
        if (!body.url) return res.json({ error: "Url is required" });

        const shortIdValue = shortid.generate();
        await URL.create({
            shortId: shortIdValue,
            redirectUrl: body.url,
            visitHistory: [],
        });

        return res.render("Home", {
            id: shortIdValue,
        });
    }
    catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    // return res.json({ id: shortIdValue });
}

async function getAnalytics(req: Request, res: Response) {
    try {
        const shortIdValue = req.params.shortId;
        const result = await URL.findOne({ shortId: shortIdValue });

        return res.json({
            totalClicks: result?.visitHistory.length || 0,
            analytics: result?.visitHistory || [],
        });
    }
    catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function HomePage(req: Request, res: Response) {
    try {
        const allUrls = await URL.find({});
        return res.render("Home", {
            urls: allUrls,
        });
    }
    catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {
    shortUrl,
    getAnalytics,
    HomePage,
};
