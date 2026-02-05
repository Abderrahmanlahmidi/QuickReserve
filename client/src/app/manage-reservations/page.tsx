import ReservationManager from "../../../components/mod/reservations/ReservationManager";

export default function ManageReservationsPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <ReservationManager />
            </div>
        </div>
    );
}
