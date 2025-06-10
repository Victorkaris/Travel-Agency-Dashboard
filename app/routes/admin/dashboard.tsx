import { StatsCard, TripCard } from "components";
import Header from "../../../components/Header";
import { dashboardStats, user,  allTrips } from "~/constants";
import { getUser } from "~/appwrite/auth";
import type { Route } from "./+types/dashboard";

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } = dashboardStats;

// export async function clientLoader () {
//     return await getUser();
// }


export const clientLoader = async () => await getUser();

const dashboard = ({ loaderData }: Route.ComponentProps) => {
    const user = loaderData as User | null;

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? "Guest"} 👋`}
        description="Welcome to your dashboard, where you can manage your tours, view statistics, and more."        
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

          <StatsCard 
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />

          <StatsCard 
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCard 
            headerTitle="Active Users Today"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />

        </div>
      </section>

    <section className="flex flex-col gap-6">
        <section className="container">
            <h1 className="text-xl font-semibold text-dark"> Created Trips</h1>

            <div className="trip-grid">
                {allTrips.slice(0,4).map(({id, name, imageUrls, itinerary, tags, estimatedPrice}) => (
                    <TripCard
                        key={id}
                        id={id.toString()}
                        name={name}
                        imageUrl={imageUrls[0]}
                        location={itinerary?.[0]?.location ?? " "}
                        tags={tags}
                        price={estimatedPrice}
                     />))}
            </div>

        </section>
    </section>

    </main>
  );
};

export default dashboard;
