REVOKE EXECUTE ON FUNCTION public.is_trip_participant(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_trip_participant(uuid, uuid) TO authenticated;