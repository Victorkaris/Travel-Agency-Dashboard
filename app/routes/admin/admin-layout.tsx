import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { NavItems, MobileSidebar } from "components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";
import { useEffect } from "react";

export async function clientLoader() {
    try{
        const user = await account.get();

        if (!user.$id) return redirect('/sign-in');

        const existingUser = await getExistingUser(user.$id);

        if (existingUser?.status === 'user') {
            return redirect('/')
        }

        return existingUser?.$id ? existingUser : await storeUserData();
        
    } catch (error) {
        console.error("Error in clientLoader:", error);
        return redirect('/sign-in');
    }
}

const AdminLayout = () => {
  useEffect(() => {
    const ensureUserStored = async () => {
      try {
        const user = await account.get();
        const exists = await getExistingUser(user.$id);
        if (!exists) {
          await storeUserData(); // ✅ store the user immediately if not already
        }
      } catch (error) {
        console.error("Failed to ensure user data is stored:", error);
      }
    };

    ensureUserStored();
  }, []);
    
  return (
    <div className="admin-layout">
      <MobileSidebar />

      <aside className="w full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
