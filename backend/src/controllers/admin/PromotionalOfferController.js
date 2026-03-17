import * as OfferModel from "../../models/PromotionalOfferModel.js";

export async function index(req, res) {
  try {
    const data = await OfferModel.getAllOffers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function store(req, res) {
  try {
    const { title, description, status, targets } = req.body;
    // targets should be an array like [{type: 'product', id: 101}, ...]
    
    let banner_image = null;
    if (req.file) {
      banner_image = req.file.filename;
    }

    const parsedTargets = targets ? JSON.parse(targets) : [];

    const offerId = await OfferModel.createOffer({
      title,
      description,
      banner_image,
      status
    }, parsedTargets);

    res.status(201).json({ id: offerId, message: "Offer created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, targets } = req.body;
    
    let banner_image = null;
    if (req.file) {
      banner_image = req.file.filename;
    }

    const parsedTargets = targets ? JSON.parse(targets) : null;

    await OfferModel.updateOffer(id, {
      title,
      description,
      banner_image,
      status
    }, parsedTargets);

    res.json({ message: "Offer updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function toggleStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await OfferModel.updateOfferStatus(id, status);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function destroy(req, res) {
  try {
    const { id } = req.params;
    await OfferModel.deleteOffer(id);
    res.json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
