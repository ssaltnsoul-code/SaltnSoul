import { AdminLayout } from '@/components/AdminLayout';
import { CollectionManager } from '@/components/CollectionManager';

export default function AdminCollections() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Collections & Website Sections</h2>
          <p className="text-muted-foreground">
            Manage which products appear in different sections of your website. Connect your Shopify collections or manually select products for each section.
          </p>
        </div>
        
        <CollectionManager />
      </div>
    </AdminLayout>
  );
}
