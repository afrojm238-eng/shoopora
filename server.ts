import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import { supabase } from "./src/lib/supabase";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Proxy for Supabase to avoid CORS issues
  app.get("/api/products", async (req, res) => {
    const { limit, offset } = req.query;
    try {
      let query = supabase.from('products').select('*').order('id', { ascending: false });
      
      if (limit) {
        const l = parseInt(limit as string);
        const o = parseInt((offset as string) || '0');
        query = query.range(o, o + l - 1);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/orders", async (req, res) => {
    const { userId } = req.query;
    try {
      let query = supabase.from('orders').select('*').order('date', { ascending: false });
      if (userId) query = query.eq('userId', userId as string);
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(`Auth: Login attempt for ${email}`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error(`Auth: Login failed for ${email}:`, error.message);
        throw error;
      }
      console.log(`Auth: Login successful for ${email}`);
      res.json(data);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    const { email, password, metadata } = req.body;
    console.log(`Auth: Signup attempt for ${email}`);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: metadata }
      });
      if (error) {
        console.error(`Auth: Signup failed for ${email}:`, error.message);
        throw error;
      }
      console.log(`Auth: Signup successful for ${email}`);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const product = req.body;
      let result;
      
      if (product.id) {
        // Update existing: remove id from update data to avoid identity column errors
        const { id, ...updateData } = product;
        result = await supabase.from('products').update(updateData).eq('id', id).select().single();
      } else {
        // Insert new: explicitly remove id if it's null/undefined
        const { id, ...insertData } = product;
        result = await supabase.from('products').insert(insertData).select().single();
      }
      
      if (result.error) throw result.error;
      res.json(result.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/products", async (req, res) => {
    try {
      const { error } = await supabase.from('products').delete().neq('id', 0);
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/orders", async (req, res) => {
    try {
      const { error } = await supabase.from('orders').delete().neq('id', '0');
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const order = req.body;
      let result;
      
      // If order has a string ID (like ORD-...), we use it as is
      // But we check if we should use upsert or insert
      if (order.id) {
        result = await supabase.from('orders').upsert(order).select().single();
      } else {
        result = await supabase.from('orders').insert(order).select().single();
      }
      
      if (result.error) throw result.error;
      res.json(result.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const { error } = await supabase.from('orders').update(req.body).eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Visitor Stats
  let fallbackVisitorCount = 0;

  app.get("/api/stats/visitors", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('count')
        .eq('id', 'visitor_count')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return res.json({ count: 0 });
        if (error.code === '42P01') {
          console.error("Database Error: 'site_stats' table missing. Run this in Supabase SQL Editor: CREATE TABLE site_stats (id TEXT PRIMARY KEY, count INTEGER DEFAULT 0); INSERT INTO site_stats (id, count) VALUES ('visitor_count', 0);");
          return res.json({ count: fallbackVisitorCount });
        }
        throw error;
      }
      res.json({ count: data?.count || 0 });
    } catch (error: any) {
      const msg = error.message || error;
      if (!msg.includes("Could not find the table") && !msg.includes("schema cache")) {
        console.error('Error fetching visitor count:', msg);
      }
      res.json({ count: fallbackVisitorCount });
    }
  });

  app.post("/api/stats/visitors/increment", async (req, res) => {
    try {
      // Get current count
      const { data, error: fetchError } = await supabase
        .from('site_stats')
        .select('count')
        .eq('id', 'visitor_count')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116' && fetchError.code !== '42P01') {
        const msg = fetchError.message;
        if (!msg.includes("Could not find the table")) throw fetchError;
      }

      const currentCount = data?.count || fallbackVisitorCount;
      const newCount = currentCount + 1;
      fallbackVisitorCount = newCount;

      // Upsert new count
      const { data: upsertData, error: upsertError } = await supabase
        .from('site_stats')
        .upsert({ id: 'visitor_count', count: newCount })
        .select()
        .single();

      if (upsertError) {
        if (upsertError.code === '42P01' || upsertError.message.includes("Could not find the table")) {
          console.error("Database Error: 'site_stats' table missing. Run this in Supabase SQL Editor: CREATE TABLE site_stats (id TEXT PRIMARY KEY, count INTEGER DEFAULT 0); INSERT INTO site_stats (id, count) VALUES ('visitor_count', 0);");
          return res.json({ count: fallbackVisitorCount });
        }
        throw upsertError;
      }
      res.json({ count: upsertData.count });
    } catch (error: any) {
      const msg = error.message || error;
      if (!msg.includes("Could not find the table") && !msg.includes("schema cache")) {
        console.error('Error incrementing visitor count:', msg);
      }
      // Even if DB fails, we increment our local fallback for this session
      res.json({ count: fallbackVisitorCount });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
