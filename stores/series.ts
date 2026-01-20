
import { reactive } from 'vue';
import { Series } from '../types';
import { getSeries, createSeries, updateSeries, deleteSeries } from '../services/api';

export const seriesStore = reactive({
    series: [] as Series[],
    loading: false,
    error: null as string | null,

    async fetchSeries() {
        this.loading = true;
        try {
            this.series = await getSeries();
        } catch (err) {
            this.error = (err as Error).message;
            console.error(err);
        } finally {
            this.loading = false;
        }
    },

    async addSeries(newSeries: Partial<Series>) {
        try {
            const createdSeries = await createSeries(newSeries);
            this.series.push(createdSeries);
        } catch (err) {
            this.error = "Failed to add series";
        }
    },

    async updateSeries(id: string, updatedSeries: Partial<Series>) {
        try {
            const result = await updateSeries(id, updatedSeries);
            const index = this.series.findIndex(s => s.id === id);
            if (index !== -1) {
                this.series[index] = { ...this.series[index], ...result };
            }
        } catch (err) {
            console.error(err);
            this.error = "Failed to update series";
        }
    },

    async removeSeries(id: string) {
        try {
            await deleteSeries(id);
            this.series = this.series.filter(s => s.id !== id);
        } catch (err) {
            console.error(err);
            this.error = "Failed to delete series";
        }
    },

    getSeriesById(id: string) {
        return this.series.find(s => s.id === id);
    }
});
