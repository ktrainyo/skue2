import { useSupabase } from '@/composables/useSupabase';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { price } = req.body;

  try {
    const supabase = useSupabase();
    const { error } = await supabase
      .from('sol_price')
      .insert([{ price }]);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).send('SOL price updated successfully');
  } catch (error) {
    console.error('Error updating SOL price:', error);
    res.status(500).send('Error updating SOL price');
  }
};
