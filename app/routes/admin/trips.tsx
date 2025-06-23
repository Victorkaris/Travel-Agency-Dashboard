import { Header, TripCard } from "components"
import type { Route } from "./+types/trips";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1',  10);
    const offset = (page - 1) * limit;

    const {allTrips, total} = await getAllTrips(limit, offset);

    return {
        trips: allTrips.map(({$id, tripDetail, imageUrl})=> ({
            id: $id,
            ...parseTripData(tripDetail),
            imageUrl: imageUrl ?? []
        })),
        total
    }    
}

const Trips = ({ loaderData } : Route.ComponentProps) => {
    const trips = loaderData.trips as Trip[] | [];

    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get('page') || '1')

    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`
    }

    return (
        <main className='all-users wrapper'>
        <Header 
            title= "Trips"
            description="View and edit AI-generated travel plans."
            ctaText = "create a trip"
            ctaUrl='/trips/create'
            />

            <section>
                <h1 className='p-24-semibold text-dark-100 mb-4'>
                    Manage Created Trips
                </h1>

                <div className='trip-grid mb-4'>
                    {trips.map((trip) => (
                    <TripCard 
                        key={trip.id} // Use $id as the unique identifier from Appwrite
                        id={trip.id}
                        name={trip.name}
                        location={trip.itinerary?.[0]?.location ?? ''}
                        imageUrl={trip.imageUrl[0]}
                        tags={[trip.interests, trip.travelStyle]}
                        price={trip.estimatedPrice || '$0'} // Use estimatedPrice from each trip
                    />
                    ))}
                </div>

                <PagerComponent
                    totalRecordsCount = {loaderData.total}
                    pageSize={8}
                    currentPage={currentPage}
                    click={(args) => handlePageChange(args.currentPage)}
                    cssClass='!mb-4'
                />
            </section>

        </main>
    )
}

export default Trips