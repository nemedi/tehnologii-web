function spy(targetNode, tagName, callback) {
	const observer = new MutationObserver(mutationsList => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.tagName === tagName.toUpperCase()) {
						callback(node);
					}
				});
			}
		}
	});
	observer.observe(targetNode, {
	  childList: true,
	  subtree: true,
	});
}