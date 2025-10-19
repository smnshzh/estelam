/**
 * Cloudflare Worker برای سیستم چت
 */

export interface ChatMessage {
  id: string;
  channel_id: string;
  user_id: string;
  user_name: string;
  message: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  created_at: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'private' | 'group' | 'customer_support';
  customer_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ChatChannelMember {
  id: string;
  channel_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      switch (path) {
        case '/api/chat/channels':
          return handleChannels(request, env, corsHeaders);
        case '/api/chat/messages':
          return handleMessages(request, env, corsHeaders);
        case '/api/chat/members':
          return handleMembers(request, env, corsHeaders);
        default:
          return new Response('Not Found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  },
};

async function handleChannels(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');
    
    if (!userId) {
      return new Response('User ID required', { status: 400, headers: corsHeaders });
    }

    // دریافت کانال‌های کاربر
    const channels = await env.DB.prepare(`
      SELECT c.*, cm.role 
      FROM chat_channels c
      JOIN chat_channel_members cm ON c.id = cm.channel_id
      WHERE cm.user_id = ?
      ORDER BY c.updated_at DESC
    `).bind(userId).all();

    return new Response(JSON.stringify({ channels: channels.results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    const data = await request.json();
    
    const channelId = `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // ایجاد کانال جدید
    await env.DB.prepare(`
      INSERT INTO chat_channels (id, name, type, customer_id, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      channelId,
      data.name,
      data.type,
      data.customer_id || null,
      data.created_by,
      now,
      now
    ).run();

    // اضافه کردن سازنده به کانال
    await env.DB.prepare(`
      INSERT INTO chat_channel_members (id, channel_id, user_id, role, joined_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channelId,
      data.created_by,
      'admin',
      now
    ).run();

    return new Response(JSON.stringify({ 
      channel_id: channelId,
      message: 'Channel created successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}

async function handleMessages(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const channelId = url.searchParams.get('channel_id');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    if (!channelId) {
      return new Response('Channel ID required', { status: 400, headers: corsHeaders });
    }

    // دریافت پیام‌های کانال
    const messages = await env.DB.prepare(`
      SELECT m.*, u.name as user_name
      FROM chat_messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.channel_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(channelId, limit, offset).all();

    return new Response(JSON.stringify({ 
      messages: messages.results.reverse() // جدیدترین پیام‌ها در آخر
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    const data = await request.json();
    
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // ایجاد پیام جدید
    await env.DB.prepare(`
      INSERT INTO chat_messages (id, channel_id, user_id, message, message_type, file_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      messageId,
      data.channel_id,
      data.user_id,
      data.message,
      data.message_type || 'text',
      data.file_url || null,
      now
    ).run();

    // بروزرسانی زمان آخرین فعالیت کانال
    await env.DB.prepare(`
      UPDATE chat_channels 
      SET updated_at = ? 
      WHERE id = ?
    `).bind(now, data.channel_id).run();

    return new Response(JSON.stringify({ 
      message_id: messageId,
      message: 'Message sent successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}

async function handleMembers(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const channelId = url.searchParams.get('channel_id');

    if (!channelId) {
      return new Response('Channel ID required', { status: 400, headers: corsHeaders });
    }

    // دریافت اعضای کانال
    const members = await env.DB.prepare(`
      SELECT cm.*, u.name as user_name, u.email
      FROM chat_channel_members cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.channel_id = ?
      ORDER BY cm.joined_at ASC
    `).bind(channelId).all();

    return new Response(JSON.stringify({ members: members.results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    const data = await request.json();
    
    const memberId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // اضافه کردن عضو جدید
    await env.DB.prepare(`
      INSERT INTO chat_channel_members (id, channel_id, user_id, role, joined_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      memberId,
      data.channel_id,
      data.user_id,
      data.role || 'member',
      now
    ).run();

    return new Response(JSON.stringify({ 
      member_id: memberId,
      message: 'Member added successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
}

interface Env {
  DB: D1Database;
}
