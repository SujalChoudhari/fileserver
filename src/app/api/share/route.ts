// app/api/share/route.js (for Next.js App Router)
// or pages/api/share.js (for Next.js Pages Router)


import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const pb = new PocketBase('https://sujal.pockethost.io');

        const title = formData.get('title');
        const text = formData.get('text');
        const url = formData.get('url');
        const file = formData.get('file');

        if (file) {
            const pbFormData = new FormData();
            // pbFormData.append('file', file);
            // if (title) pbFormData.append('title', title);
            // if (text) pbFormData.append('text', text);
            // if (url) pbFormData.append('url', url);

            let unique;
            do {
                unique = generateUniqueCode();
            } while (await pb.collection('files').getFirstListItem(`unique="${unique}"`).catch(() => null));

            pbFormData.append('unique', unique);

            await pb.collection('files').create(pbFormData);

            return redirect(`/${unique}`);
        } else {
            return redirect(`/`);
        }
    } catch (error: any) {
        console.error('Error handling shared content:', error?.message);
        return redirect(`/`);
    }


}

function generateUniqueCode() {
    const alphabets = 'abcdefghijkmnopqrstuvwxyz';
    const twoAlphabets = alphabets[Math.floor(Math.random() * 25)] + alphabets[Math.floor(Math.random() * 25)];
    const twoNumbers = Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10);
    return twoAlphabets + twoNumbers;
}
