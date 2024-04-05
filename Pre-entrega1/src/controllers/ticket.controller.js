
import TicketDao from '../daos/ticket.dao.js';
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

export const updateTicketController = async (req, res) => {
    const { ticketId } = req.params;
    const updatedData = req.body; // Datos actualizados enviados en el cuerpo de la solicitud
    try {
        const updatedTicket = await TicketDao.updateTicket(ticketId, updatedData);
        res.json({ message: 'Ticket actualizado', updatedTicket });
    } catch (error) {
        logger.error('Error al actualizar el ticket:', error);
        res.status(500).json({ error: 'Hubo un error al actualizar el ticket' });
    }
};

export const deleteTicketController = async (req, res) => {
    const { ticketId } = req.params;
    try {
        const deletedTicket = await TicketDao.deleteTicket(ticketId);
        res.json({ message: 'Ticket eliminado', deletedTicket });
    } catch (error) {
        logger.error('Error al eliminar el ticket:', error);
        res.status(500).json({ error: 'Hubo un error al eliminar el ticket' });
    }
};
