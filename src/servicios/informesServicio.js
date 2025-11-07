import PDFDocument from 'pdfkit'; 

export default class InformesServicio {
    
    // Este método recibe los datos y devuelve el PDF en memoria buffer
    informeReservasPdf = async (datos) => {
        
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 30, size: 'A4' });
                const buffers = []; 
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData); 
                });

                doc.fontSize(18).text('Reporte de Reservas', { align: 'center' });
                doc.moveDown(2);

                for (const reserva of datos) {
                    doc.fontSize(14).font('Helvetica-Bold').text(`Reserva ID: ${reserva.reserva_id}`);
                    doc.fontSize(11).font('Helvetica');
                    const fecha = new Date(reserva.fecha_reserva).toLocaleDateString('es-AR');
                    
                    doc.text(`Fecha: ${fecha}`);
                    doc.text(`Cliente: ${reserva.cliente_nombre} (${reserva.cliente_email})`);
                    doc.text(`Salón: ${reserva.salon_titulo}`);
                    doc.text(`Turno: ${reserva.turno_horario}`);
                    doc.text(`Temática: ${reserva.tematica || 'N/A'}`);
                    doc.text(`Servicios: ${reserva.servicios_contratados || 'Ninguno'}`);
                    doc.font('Helvetica-Bold').text(`Importe Total: $${reserva.importe_total}`);
                    
                    doc.moveDown().lineCap('round').dash(1, {space: 2})
                    .moveTo(30, doc.y).lineTo(565, doc.y).stroke("#aaaaaa").undash();
                    doc.moveDown(2);
                }

                doc.end(); 
                
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }
}