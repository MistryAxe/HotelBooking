// Remove Fake Store API usage by providing a no-op export to avoid imports breaking
export const fetchDeals = async () => ({ success: true, deals: [] });
