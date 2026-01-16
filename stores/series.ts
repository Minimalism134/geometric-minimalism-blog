
import { reactive } from 'vue';
import { Series } from '../types';

export const seriesStore = reactive({
    series: [] as Series[],
    loading: false,
    error: null as string | null,

    async fetchSeries() {
        this.loading = true;
        try {
            const response = await fetch('http://127.0.0.1:5000/api/series');
            if (!response.ok) throw new Error('Failed to fetch series');
            this.series = await response.json();
        } catch (err) {
            this.error = (err as Error).message;
            console.error(err);
        } finally {
            this.loading = false;
        }
    },

    async addSeries(newSeries: Partial<Series>) {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/series', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSeries),
            });
            if (!response.ok) throw new Error('Failed to create series');
            const createdSeries = await response.json();
            this.series.push(createdSeries);
        } catch (err) {
            this.error = "Failed to add series";
        }
    },

    async updateSeries(id: string, updatedSeries: Partial<Series>) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/series/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSeries),
            });
            if (!response.ok) throw new Error('Failed to update series');
            const result = await response.json();
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
            const response = await fetch(`http://127.0.0.1:5000/api/series/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete series');
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
